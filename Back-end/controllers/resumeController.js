const { PDFParse } = require("pdf-parse");
const config = require("../configs/config");
const fetch = require('node-fetch');

// ===== Helper function to calculate category scores =====
const calculateCategoryScores = (parsedData, resumeText) => {
  // Initialize scores object
  const scores = {
    contactInfo: 0,
    skills: 0,
    experience: 0,
    education: 0,
    completeness: 0
  };

  // 1. Contact Information Score (out of 100)
  let contactScore = 0;
  if (parsedData.personal_info?.name) contactScore += 25;
  if (parsedData.personal_info?.email) contactScore += 25;
  if (parsedData.personal_info?.phone) contactScore += 25;
  if (parsedData.personal_info?.location) contactScore += 25;
  scores.contactInfo = contactScore;

  // 2. Skills Score (out of 100)
  const skillCount = parsedData.skills?.length || 0;
  // 0 skills = 0, 10+ skills = 100, scale linearly
  scores.skills = Math.min(Math.round((skillCount / 10) * 100), 100);

  // 3. Experience Score (out of 100)
  let expScore = 0;
  const expCount = parsedData.experience?.length || 0;
  
  if (expCount > 0) {
    // Base score from number of experiences (max 40 points)
    expScore += Math.min(expCount * 20, 40);
    
    // Quality score from descriptions (max 60 points)
    let qualityScore = 0;
    parsedData.experience.forEach(exp => {
      if (exp.description) {
        // Check description length (max 15 points per experience)
        if (exp.description.length > 100) qualityScore += 15;
        else if (exp.description.length > 50) qualityScore += 10;
        else if (exp.description.length > 20) qualityScore += 5;
        
        // Check for achievement keywords (bonus 5 points per experience)
        if (/increased|improved|achieved|delivered|reduced|launched|created|developed|managed|led/i.test(exp.description)) {
          qualityScore += 5;
        }
      }
    });
    
    // Cap quality score at 60
    expScore += Math.min(qualityScore, 60);
  }
  scores.experience = expScore;

  // 4. Education Score (out of 100)
  const eduCount = parsedData.education?.length || 0;
  // 0 education = 0, 2+ education entries = 100, scale linearly
  scores.education = Math.min(Math.round((eduCount / 2) * 100), 100);

  // 5. Completeness Score (out of 100)
  let completenessScore = 0;
  
  // Text length (max 40 points)
  if (resumeText.length > 2000) completenessScore += 40;
  else if (resumeText.length > 1500) completenessScore += 30;
  else if (resumeText.length > 1000) completenessScore += 20;
  else if (resumeText.length > 500) completenessScore += 10;
  
  // Section completeness (max 60 points)
  if (parsedData.personal_info?.name) completenessScore += 10;
  if (parsedData.skills?.length > 0) completenessScore += 15;
  if (parsedData.experience?.length > 0) completenessScore += 20;
  if (parsedData.education?.length > 0) completenessScore += 15;
  
  scores.completeness = Math.min(completenessScore, 100);

  return scores;
};

// ===== Calculate weighted average =====
const calculateWeightedAverage = (scores) => {
  const weights = {
    contactInfo: 0.20,    // 20%
    skills: 0.25,         // 25%
    experience: 0.30,     // 30%
    education: 0.15,      // 15%
    completeness: 0.10    // 10%
  };

  const weightedScore = 
    (scores.contactInfo * weights.contactInfo) +
    (scores.skills * weights.skills) +
    (scores.experience * weights.experience) +
    (scores.education * weights.education) +
    (scores.completeness * weights.completeness);

  return Math.round(weightedScore);
};

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Initialize parser with PDF buffer
    const parser = new PDFParse({ data: req.file.buffer });

    // Step 2: Extract text
    const pdfResult = await parser.getText();
    await parser.destroy();

    const resumeText = pdfResult.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    console.log("✅ Text extracted:", resumeText.length);

    // Step 3: Prepare prompt for Hugging Face (EXTRACTION)
    const extractionMessages = [
      {
        role: "system",
        content: "You are a resume parser. Extract structured JSON. Use null for missing fields.",
      },
      {
        role: "user",
        content: `
Extract the following from this resume and return ONLY valid JSON (no other text):

{
  "personal_info": {
    "name": "full name",
    "email": "email address",
    "phone": "phone number",
    "location": "city/state"
  },
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "job_title": "position",
      "company": "company name",
      "duration": "start-end",
      "description": "description"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school",
      "year": "year"
    }
  ]
}

Resume:
${resumeText}
        `,
      },
    ];

    // ===== STEP 4: Call Hugging Face for EXTRACTION =====
    console.log("🤖 Extracting resume data...");
    
    let extractionResponse;
    try {
      const apiResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.hfkey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: extractionMessages,
          max_tokens: 1500,
          temperature: 0.1,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      extractionResponse = await apiResponse.json();
      console.log("✅ Extraction successful");
      
    } catch (primaryError) {
      console.log("🔄 Trying fallback model for extraction...");
      
      const fallbackResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.hfkey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-Coder-32B-Instruct",
          messages: extractionMessages,
          max_tokens: 1500,
          temperature: 0.1,
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Both models failed`);
      }

      extractionResponse = await fallbackResponse.json();
      console.log("✅ Fallback extraction successful");
    }

    // Parse extraction data
    const rawOutput = extractionResponse.choices[0].message.content;
    let parsedData;
    
    try {
      parsedData = JSON.parse(rawOutput);
    } catch {
      const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({
          error: "Model did not return valid JSON",
          raw: rawOutput,
        });
      }
    }

    // Ensure required structure
    if (!parsedData.personal_info) parsedData.personal_info = {};
    if (!parsedData.skills) parsedData.skills = [];
    if (!parsedData.experience) parsedData.experience = [];
    if (!parsedData.education) parsedData.education = [];

    // ===== STEP 5: Calculate Category Scores =====
    console.log("📊 Calculating category scores...");
    const categoryScores = calculateCategoryScores(parsedData, resumeText);
    
    // Calculate weighted average
    const weightedAverage = calculateWeightedAverage(categoryScores);
    console.log("✅ Weighted average score:", weightedAverage);

    // ===== STEP 6: Get AI Evaluation with Strengths & Improvements =====
    console.log("🤖 Getting AI evaluation with strengths & improvements...");
    
    const evaluationMessages = [
      {
        role: "system",
        content: "You are a resume evaluator. Score resumes and provide detailed feedback.",
      },
      {
        role: "user",
        content: `
Based on this resume, provide:
1. strengths (array of 3-5 key strengths with specific details)
2. improvements (array of 3-5 specific areas to improve)
3. summary (brief overall assessment)

Resume content:
${resumeText}

Return ONLY valid JSON in this format:
{
  "strengths": [
    "Strong technical skills across multiple technologies including React, Next.js, and Node.js",
    "Clear work experience with detailed project descriptions",
    "Good mix of technical and soft skills"
  ],
  "improvements": [
    "Add more quantifiable achievements to work experience",
    "Include links to portfolio or GitHub",
    "Expand education section with more details"
  ],
  "summary": "A solid resume with good technical foundation but could benefit from more metrics and achievements."
}
        `,
      },
    ];

    // Call API for evaluation feedback
    let evaluationData = {
      strengths: [],
      improvements: [],
      summary: "Resume analyzed successfully."
    };

    try {
      const evalApiResponse = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.hfkey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          messages: evaluationMessages,
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (evalApiResponse.ok) {
        const evalResponse = await evalApiResponse.json();
        const evalRawOutput = evalResponse.choices[0].message.content;
        
        try {
          evaluationData = JSON.parse(evalRawOutput);
        } catch {
          const evalJsonMatch = evalRawOutput.match(/\{[\s\S]*\}/);
          if (evalJsonMatch) {
            evaluationData = JSON.parse(evalJsonMatch[0]);
          }
        }
      }
    } catch (evalError) {
      console.log("⚠️ AI evaluation failed, using fallback strengths");
      
      // ===== FALLBACK: Generate strengths based on parsed data =====
      const fallbackStrengths = [];
      const fallbackImprovements = [];
      
      // Generate strengths from data
      if (parsedData.skills?.length > 10) {
        fallbackStrengths.push(`Strong technical skills with ${parsedData.skills.length} skills listed`);
      } else if (parsedData.skills?.length > 5) {
        fallbackStrengths.push(`Good range of skills (${parsedData.skills.length} skills)`);
      }
      
      if (parsedData.experience?.length > 1) {
        fallbackStrengths.push(`Solid work experience with ${parsedData.experience.length} positions`);
      } else if (parsedData.experience?.length > 0) {
        fallbackStrengths.push(`Work experience documented`);
      }
      
      if (parsedData.personal_info?.email && parsedData.personal_info?.phone) {
        fallbackStrengths.push("Complete contact information provided");
      }
      
      if (parsedData.education?.length > 0) {
        fallbackStrengths.push("Education section included");
      }
      
      // Generate improvements
      if (!parsedData.personal_info?.email || !parsedData.personal_info?.phone) {
        fallbackImprovements.push("Add complete contact information");
      }
      
      if (parsedData.skills?.length < 5) {
        fallbackImprovements.push("Expand skills section with more relevant skills");
      }
      
      if (parsedData.experience?.length === 0) {
        fallbackImprovements.push("Add work experience section");
      } else {
        // Check if experiences have achievements
        const hasAchievements = parsedData.experience.some(exp => 
          /increased|improved|achieved|delivered|reduced|launched|created|developed|managed|led/i.test(exp.description || '')
        );
        if (!hasAchievements) {
          fallbackImprovements.push("Add quantifiable achievements to work experience (e.g., 'increased sales by 20%')");
        }
      }
      
      if (parsedData.education?.length === 0) {
        fallbackImprovements.push("Include education section");
      }
      
      if (resumeText.length < 1000) {
        fallbackImprovements.push("Add more detail to resume sections");
      }
      
      // Ensure we have at least some items
      if (fallbackStrengths.length === 0) {
        fallbackStrengths.push("Resume contains basic information");
      }
      
      if (fallbackStrengths.length < 2) {
        fallbackStrengths.push("Skills section present");
      }
      
      if (fallbackImprovements.length === 0) {
        fallbackImprovements.push("Add more quantifiable achievements");
        fallbackImprovements.push("Include links to portfolio or projects");
      }
      
      evaluationData = {
        strengths: fallbackStrengths,
        improvements: fallbackImprovements,
        summary: `Resume scored ${weightedAverage}/100. This resume has ${fallbackStrengths[0].toLowerCase()}. To improve, ${fallbackImprovements[0].toLowerCase()}.`
      };
    }

    // ===== STEP 7: Return result with both category scores AND strengths =====
    res.status(200).json({
      success: true,
      data: parsedData,
      scores: {
        overall: weightedAverage,
        categories: {
          contactInfo: {
            score: categoryScores.contactInfo,
            maxScore: 100,
            weight: "20%",
            details: {
              hasName: !!parsedData.personal_info.name,
              hasEmail: !!parsedData.personal_info.email,
              hasPhone: !!parsedData.personal_info.phone,
              hasLocation: !!parsedData.personal_info.location
            }
          },
          skills: {
            score: categoryScores.skills,
            maxScore: 100,
            weight: "25%",
            details: {
              skillCount: parsedData.skills.length,
              skills: parsedData.skills
            }
          },
          experience: {
            score: categoryScores.experience,
            maxScore: 100,
            weight: "30%",
            details: {
              experienceCount: parsedData.experience.length,
              experiences: parsedData.experience.map(exp => ({
                title: exp.job_title,
                hasQualityDescription: exp.description?.length > 50,
                hasAchievements: /increased|improved|achieved|delivered|reduced|launched|created|developed|managed|led/i.test(exp.description || '')
              }))
            }
          },
          education: {
            score: categoryScores.education,
            maxScore: 100,
            weight: "15%",
            details: {
              educationCount: parsedData.education.length,
              education: parsedData.education
            }
          },
          completeness: {
            score: categoryScores.completeness,
            maxScore: 100,
            weight: "10%",
            details: {
              textLength: resumeText.length,
              hasAllSections: (
                !!parsedData.personal_info.name &&
                parsedData.skills.length > 0 &&
                parsedData.experience.length > 0 &&
                parsedData.education.length > 0
              )
            }
          }
        }
      },
      evaluation: {
        strengths: evaluationData.strengths,
        improvements: evaluationData.improvements,
        summary: evaluationData.summary
      },
      metadata: {
        filename: req.file.originalname,
        pageCount: pdfResult.pages.length,
        textLength: resumeText.length,
      },
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.message.includes("rate limit")) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return res.status(401).json({ 
        error: "Invalid API key",
        details: "Check your Hugging Face API key in config"
      });
    }

    res.status(500).json({
      error: "Failed to analyze resume",
      details: error.message,
    });
  }
};

module.exports = { analyzeResume };