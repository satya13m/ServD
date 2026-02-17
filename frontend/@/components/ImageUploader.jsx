"use client"

import { Camera, ImageIcon, Upload,X } from "lucide-react";
import React, { useCallback, useState,useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { ClipLoader } from "react-spinners";


export default function ImageUploader({onImageSelect,loading}) {
    const [preview,setPreview]= useState(null);
    const fileInputRef = useRef(null);


  const onDrop = useCallback((acceptedFiles) => {
      const file = acceptedFiles[0] //only need one file
      if(!file) return;


      const reader = new FileReader();
      reader.onloadend = () => {
       setPreview(reader.result);
       onImageSelect(file);
      };
      reader.readAsDataURL(file);
   
  }, [onImageSelect]);


  const { getRootProps, getInputProps ,isDragActive,open} = useDropzone({ onDrop,
    accept:{
        "image/*" : [".jpeg",".jpg",".png",".webp"]
    },
    maxFiles:1,
    maxSize:10485760 ,//10mb
    noClick: true,
    noKeyboard:true

   });

   const handleFileInputChange = (e)=>{
    const file = e.target.files?.[0];
    if(file){
        onDrop([file])
    }
   }

   const clearImage = ()=>{
    setPreview(null);
    onImageSelect(null);
    if(fileInputRef.current){
        fileInputRef.current.value = ""
    }
   }

   //Preview Mode
   if(preview){
    return (
      <div className="relative w-full aspect-video bg-stone-100 rounded-2xl overflow-hidden border-2 border-stone-200">
        <Image
          src={preview}
          alt="Pantry Preview"
          fill
          className="object-cover"
        />

        {!loading && (
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <ClipLoader color="white"/>
          </div>
        )}
      </div>
    );
    
   }

  return (
    <>
      <div
        {...getRootProps()}
        className={` relative w-full aspect-square border-2 border-dashed rounded-2xl transition-all cursor-pointer 
        ${isDragActive ? "border-orange-600 bg-orange-50 scale-[1.02]" : "border-stone-300 bg-stone-50 hover:border-orange-400 hover:bg-orange-50/50"}`}
      >
        <input {...getInputProps()} />
        <div
          className="  absolute inset-0 flex flex-col
      items-center justify-center gap-4 p-8 text-center"
        >
          {/**icon image */}
          <div
            className={`p-4 rounded-full transition-all ${isDragActive ? "bg-orange-600 scale-110" : "bg-orange-100"}`}
          >
            {isDragActive ? (
              <ImageIcon className="w-8 h-8 text-white" />
            ) : (
              <Camera className="w-8 h-8 text-orange-600" />
            )}
          </div>
          {/**Text */}
          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {isDragActive ? "Drop your image here" : "Scan Your Pantry"}
            </h3>
            <p className="text-stone-600 text-sm max-w-sm">
              {isDragActive
                ? "Release to upload"
                : "Take a photo or drag & drop an image of your fridge/pantry"}
            </p>
          </div>

          {/**Button */}
          {!isDragActive && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Camera/File Button - Works on both mobile & desktop /taking from mobile phone */}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="gap-2"
                variant="primary"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>

              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 gap-2"
              >
                <Upload className="w-4 h-4" />
                Browse Files
              </Button>
            </div>
          )}

          {/* Helper Text */}
          <p className="text-xs text-stone-400">
            Supports JPG, PNG, WebP • Max 10MB
          </p>
        </div>
      </div>

      {/**Hidden file Input with capture attribute for mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </>
  );
}


