"use client"
import { AddData } from '@/Requests/addData'
import { DataValues, UseData } from '@/util/FormValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
        <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8'>
            <div className='bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-md'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Add Your Data</h2>
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
                        className='w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all'
                    />
                    {errors.data && (
                        <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>
                    )}
                </form>

                <button
                    onClick={handleSubmit(AddDatatoDB)}
                    disabled={isSubmitting}
                    className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed'
                >
                    {isSubmitting ? "Adding..." : "Add Data"}
                </button>
            </div>
        </div>
    )
}

export default Page