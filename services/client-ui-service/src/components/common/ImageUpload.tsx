import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { S3UploadService } from '../../services/S3UploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  folder?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  showPreview?: boolean;
  aspectRatio?: 'square' | '16/9' | '4/3' | 'free';
}

export default function ImageUpload({
  value,
  onChange,
  onError,
  folder = 'uploads',
  className = '',
  disabled = false,
  placeholder = 'Click to upload or drag and drop',
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  aspectRatio = 'square'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadService = S3UploadService.getInstance();

  // Sync previewUrl with value prop
  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file
    const validation = uploadService.validateImageFile(file);
    if (!validation.isValid) {
      const errorMessage = validation.error || 'Invalid file';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(file, folder);
      
      if (result.success && result.url) {
        onChange(result.url);
        setPreviewUrl(result.url);
      } else {
        setError(result.error || 'Upload failed');
        onError?.(result.error || 'Upload failed');
        setPreviewUrl(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  }, [uploadService, folder, onChange, onError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(async () => {
    if (value) {
      try {
        await uploadService.deleteImage(value);
      } catch (err) {
        console.error('Failed to delete image from S3:', err);
      }
    }
    setPreviewUrl(null);
    onChange('');
    setError(null);
  }, [value, uploadService, onChange]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  const renderUploadArea = () => (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${getAspectRatioClass()}
        ${className}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={handleChange}
        disabled={disabled || isUploading}
      />
      
      <div className="flex flex-col items-center justify-center h-full">
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">
              {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {maxSize}MB
            </p>
          </>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className={`relative ${getAspectRatioClass()} ${className}`}>
      <img
        src={previewUrl || ''}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={handleRemove}
        disabled={disabled || isUploading}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
        title="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-sm text-white">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {showPreview && previewUrl ? renderPreview() : renderUploadArea()}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {value && !previewUrl && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ImageIcon className="w-4 h-4" />
          <span>Image URL: {value}</span>
        </div>
      )}
    </div>
  );
} 