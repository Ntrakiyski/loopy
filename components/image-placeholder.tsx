// components/image-placeholder.tsx

import { Music2 } from 'lucide-react';

export const ImagePlaceholder = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
            <Music2 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
    );
};