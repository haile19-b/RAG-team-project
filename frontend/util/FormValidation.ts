import * as z from "zod";

export const UseChat = z.object({
    text:z.string().min(1,"text is empty!").max(300,"your text is too long!"),
    type:z.enum(["ai","user"])
})

export type ChatValues = z.infer<typeof UseChat>


export const UseData = z.object({
    data:z.string().min(1,"this field is requered!").max(1000)
})

export type DataValues = z.infer<typeof UseData>