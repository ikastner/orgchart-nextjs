"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onFileAccepted: (file: File) => void
  onError: (error: string) => void
  maxSize?: number
}

export function FileUpload({ onFileAccepted, onError, maxSize = 1024 * 1024 }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === "file-too-large") {
        onError(`Le fichier est trop volumineux. Taille maximum: ${maxSize / 1024 / 1024}MB`)
      } else {
        onError(error.message)
      }
      return
    }

    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0])
    }
  }, [maxSize, onError, onFileAccepted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxSize,
    maxFiles: 1
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        {...getRootProps()}
        className="relative group"
      >
        <input {...getInputProps()} />
        <motion.div
          className="relative border-2 border-dashed rounded-xl p-8 transition-colors bg-background hover:bg-accent/40"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="min-h-[150px] flex flex-col items-center justify-center gap-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="rounded-full bg-primary/10 p-4"
            >
              <Upload className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xl font-medium mb-2">
                {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez votre fichier CSV"}
              </div>
              <div className="text-sm text-muted-foreground max-w-[400px]">
                ou cliquez pour sélectionner un fichier
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl bg-primary/5 backdrop-blur-sm"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}