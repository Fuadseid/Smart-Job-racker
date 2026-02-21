import { useGetCsrfTokenQuery } from "@/stores/apiSlice";
import { setCSRFToken } from "@/stores/authReducer";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initClarity } from "@/utils/clarity";
const WrapperComponent = ({ children }) => {
    const dispatch = useDispatch()
    const { data: token , isLoading: loading, isSuccess } = useGetCsrfTokenQuery();
    useEffect(() => {
        initClarity();
    }, []);
    useEffect(()=>{
        const csrf_token = token?.csrf_token;
        if(csrf_token){
            dispatch(setCSRFToken(csrf_token))
        }
    },[token]);

    
  return <div className="dark:bg-gray-800 bg-gray-100">
    {children}
    </div>
};

export default WrapperComponent;