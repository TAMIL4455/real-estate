

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PrismicBlog } from '@/app/data/prismic';
import { CalendarDays, Palmtree, CheckCircle2, Share2, Phone } from 'lucide-react';
import { PrismicRichText } from '@prismicio/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Related Blog Card Component ---
function RelatedBlogCard({ blog }: { blog: PrismicBlog }) {
    const title = blog.data.title[0]?.text || 'Untitled Blog Post';
    return (
        <Link href={`/blogs/${blog.uid}`} className="block group">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 transition-shadow hover:shadow-xl overflow-hidden">
                <div className="relative w-full h-48">
                    <Image src={blog.data.image_link.url} alt={title} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                         <CalendarDays size={12} className="text-gray-500" />
                        <span>{new Date(blog.data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">{title}</h3>
                </div>
            </div>
        </Link>
    );
}

// --- Main Client Component for the Blog Detail Page UI ---
export default function BlogClientPage({ blog, relatedBlogs }: { blog: PrismicBlog, relatedBlogs: PrismicBlog[] }) {
    const [buttonText, setButtonText] = useState('Share it');

        console.log("Blog Data in Client Page:", relatedBlogs);

    if (!blog) {
        return null;
    }

    const title = blog.data.title[0]?.text || 'Untitled Blog Post';

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: "Check out this article from Home Konnect!",
            url: window.location.href,
        };
        // ... (rest of your share logic from previous turn)
    };

    return (
        <main>
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
                {/* Blog Header */}
                <div className="mb-10 text-left">
                    <div className="flex items-start gap-3 mb-3">
                        <Palmtree size={32} className="text-green-600 flex-shrink-0" />
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight flex-grow">{title}</h1>
                    </div>
                    <p className="text-base text-gray-600 md:ml-12 mb-6">
                        {new Date(blog.data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                        <Image src={blog.data.image_link.url} alt={title} fill className="object-cover" priority />
                    </div>
                </div>

                               {/* Blog Content */}
                    <div className="prose lg:prose-lg max-w-none text-gray-700 leading-relaxed">
                    {/* This component renders Prismic's Rich Text field */}
                    {/* <PrismicRichText field={blog.data.content} /> */}

                    {/* Render Prismic 'contents' blocks (paragraphs, images, headings) */}
                    <div className="mt-8 space-y-6">
                        {(blog.data.contents || []).map((block: any, idx: number) => {
                            // Paragraph
                            if (block.type === 'paragraph') {
                                return (
                                    <p key={idx} className="text-base text-gray-700">
                                        {block.text}
                                    </p>
                                );
                            }

                            if (block.type === 'heading1') return <h1 key={idx} className="text-2xl font-bold">{block.text}</h1>;
                            if (block.type === 'heading2') return <h2 key={idx} className="text-xl font-semibold">{block.text}</h2>;
                            if (block.type === 'heading3') return <h3 key={idx} className="text-lg font-semibold">{block.text}</h3>;

                            if (block.type === 'image') {
                                const url = block.url || block.image?.url || block?.dimensions ? block.url : '';
                                const alt = block.alt || block.image?.alt || '';
                                return (
                                    <div key={idx} className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
                                        {url ? (
                                            <Image src={url} alt={alt} fill className="object-cover" />
                                        ) : null}
                                    </div>
                                );
                            }

                            
                            if (block.text) {
                                return (
                                    <p key={idx} className="text-base text-gray-700">
                                        {block.text}
                                    </p>
                                );
                            }

                            return null;
                        })}
                    </div>

                </div>


                {/* FAQ Section */}
                {blog.data.faq && blog.data.faq.length > 0 && (
                    <div className="my-12">
                        <h2 className="text-3xl font-serif text-gray-800 font-bold mb-6">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {blog.data.faq.map((faqItem, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-b">
                                <AccordionTrigger className="text-left text-lg font-semibold text-gray-800 hover:no-underline">
                                    <PrismicRichText field={faqItem.question} />
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                                    <PrismicRichText field={faqItem.answer} />
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}

                {/* Share Button */}
                <div className="mt-12 text-left">
                    <button 
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 bg-white text-green-600 font-bold py-3 px-6 rounded-full hover:bg-green-50 transition shadow-md border border-gray-200"
                    >
                        <Share2 size={20} />
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Latest in Blogs (Related Blogs) */}
            {relatedBlogs.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto max-w-7xl px-4">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-left">Latest in Blogs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedBlogs.map(rb => (
                                <RelatedBlogCard key={rb.id} blog={rb} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
