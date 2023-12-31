"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import{FcGoogle} from 'react-icons/fc';

import Input from "../../components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import {toast} from "react-hot-toast";
import {signIn, useSession} from "next-auth/react";
import { callbackify } from "util";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if(session?.status === 'authenticated'){
            router.push('/users');
        }
    }, [session?.status, router]);
    
    
    
    
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
           axios.post('/api/register', data)
           .then(() => window.location.reload())
           .catch(() => toast.error('Something went wrong!'))
           .finally(() => setIsLoading(false))
        }
        if (variant === 'LOGIN') {
            signIn('credentials',{
                ... data,
                redirect: false
            })
            .then((callback) => {
                if(callback?.error){
                    toast.error('Invalid credentials')
                }
                if(callback?.ok && !callback?.error){
                    toast.success('Logged in!');
                    router.push('/users');
                }
            })
            .finally(() => setIsLoading(false));
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        signIn(action, {redirect: false})
        .then((callback) => {
            if(callback?.error){
                toast.error('Invalid credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged in!');
            }
        })
        .finally(() => setIsLoading(false));
        //NextAuth Social  Sign In
    }

    return (
        
        <div
            className="
                mt-8 
                sm:mx-auto
                sm:w-full
                sm:max-w-md"
        >
            <h2 className='mb-6 text-center text-3xl font-bold tracking-tighter text-gray-200'>
           
            {variant === 'LOGIN'? 'Sign in to your account' : 'Sign up to your account'}
       </h2>
            
            <div
                className="
            bg-white
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10
            "
            >
                <form
                    className='space-y-6'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'REGISTER' && (
                        <Input
                            id="name"
                            label="Name"
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                    )}
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                    />
                    <div
                        className=""
                    >
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                            "
                        >
                            <div
                                className="
                                    w-full 
                                    border-t 
                                    border-gray-300"
                            />
                        </div>
                        <div
                            className="
                                relative 
                                flex 
                                justify-center
                                text-sm
                                "
                        >
                            <span
                                className="
                                    bg-white
                                    px-2
                                    text-gray-500
                                "
                            >
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            
                            icon={FcGoogle}
                            onClick={()=> socialAction('google')}
                            
                        />
                        
                    </div>
                </div>
                <div className="
                    flex
                    gap-2
                    justify-center
                    text-sm
                    px-2
                    text-gray-500
                "
                >
                    <div>
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="
                            underline cursor-pointer
                        "
                    >
                        {variant === 'LOGIN'? 'Create an account' : 'Login'}
                        
                       
                    </div>
                </div>
            </div>

        </div>
    )
};

export default AuthForm;