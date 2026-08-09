import { v2 as cloudinary } from "cloudinary";

// الحزمة تقرأ متغير البيئة CLOUDINARY_URL تلقائياً إذا كان معرفاً
// أو يمكنك ضبط الإعدادات صراحة للتحقق:
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export default cloudinary;