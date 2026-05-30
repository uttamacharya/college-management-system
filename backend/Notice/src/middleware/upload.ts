import multer, { type FileFilterCallback} from "multer";

import type {Request} from "express"

const allowedMimeTypes=[
    "image/jpeg",
    "image/png",
    "image/webp"
];

export const upload= multer({
    storage: multer.memoryStorage(),

    limits:{
        fileSize: 5*1024*1024,
        files: 1
    },

    fileFilter:(
        _req:Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    )=>{
        if(!allowedMimeTypes.includes(file.mimetype)){
            cb(new Error("Only jpg png webp, allowed "))
            return;
        }
        cb(null, true);
    }
})