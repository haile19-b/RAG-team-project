"use client"
import { AddData } from '@/Requests/addData'
import { DataValues, UseData } from '@/util/FormValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import Toggle from '../toggle-theme'

function Page() {
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DataValues>({
        resolver: zodResolver(UseData),
        defaultValues: {
            data: ""
        }
    })

    const AddDatatoDB = async (data: DataValues) => {
        try {
            const response = await AddData(data.data)
            console.log(response)
            
            // Display success message
            setMessage(response.data?.message || "Data added successfully!")
            setIsError(false)
            reset()
            
        } catch (error: any) {
            // Display error message
            setMessage(error.response?.data?.message || error.message || "Failed to add data")
            setIsError(true)
        }
    }

    return (
        <div className='min-h-screen p-4 bg-white dark:bg-gray-900 w-full flex flex-col justify-center items-center'>
            <div className="w-full flex justify-end fixed top-2 right-4">
                <Toggle/>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md shadow-sm'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>Add Your Data</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        Add information to train the AI assistant
                    </p>
                    
                    {message && (
                        <p className={`${isError ? 'text-red-500' : 'text-green-500'} font-medium`}>
                            {message}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit(AddDatatoDB)} className="mb-6">
                    <textarea
                        {...register("data")}
                        placeholder='Add your text data here...'
                        className='w-full h-32 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400'
                    />
                    {errors.data && (
                        <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>
                    )}
                </form>

                <Button
                    onClick={handleSubmit(AddDatatoDB)}
                    disabled={isSubmitting}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all'
                >
                    {isSubmitting ? "Adding..." : "Add Data"}
                </Button>
            </div>
        </div>
    )
}

export default Page