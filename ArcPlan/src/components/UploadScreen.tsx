import { Upload, Video } from 'lucide-react';
import { useState } from 'react';

interface UploadScreenProps {
  onUpload: (file: File) => void;
}

export function UploadScreen({ onUpload }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find((file) => file.type.startsWith('video/'));

    if (videoFile) {
      onUpload(videoFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onUpload(files[0]);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={`w-full max-w-3xl transition-all duration-300 ${
          isDragging ? 'scale-105' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor="file-upload"
          className={`
            relative block cursor-pointer rounded-xl p-16
            border-4 border-dashed
            transition-all duration-300
            ${
              isDragging
                ? 'border-blueprint-cyan bg-blueprint-cyan/10 shadow-[0_0_30px_rgba(0,212,255,0.3)]'
                : 'border-white/30 hover:border-blueprint-cyan/60 hover:bg-blueprint-cyan/5'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-6">
            <div
              className={`
              relative p-6 rounded-full
              transition-all duration-300
              ${
                isDragging
                  ? 'bg-blueprint-cyan shadow-[0_0_40px_rgba(0,212,255,0.6)]'
                  : 'bg-blueprint-blue'
              }
            `}
            >
              {isDragging ? (
                <Video
                  className={`w-16 h-16 text-blueprint-dark animate-glow`}
                />
              ) : (
                <Upload className="w-16 h-16 text-blueprint-cyan" />
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold text-white">
                Drag & drop your room video here
              </p>
              <p className="text-lg text-white/60">or click to browse files</p>
              <p className="text-sm text-white/40 pt-2">
                Supported formats: MP4, MOV, AVI
              </p>
            </div>
          </div>

          <input
            id="file-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
}
