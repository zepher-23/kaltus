import React from 'react';

const CategoryCard = ({ title, img, link }) => {
    return (
        <div className="bg-white z-30 p-5 flex flex-col h-[420px] shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="flex-grow mb-2">
                <img src={img} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline font-medium mt-auto">
                See more
            </div>
        </div>
    );
};

export default CategoryCard;
