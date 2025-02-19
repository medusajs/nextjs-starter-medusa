"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"


const footerLinks = {
  shop: [
    { name: "Enterprise", href: "/enterprise" },
    { name: "Business", href: "/business" },
    { name: "Education", href: "/education" },
    { name: "Government", href: "/government" },
],
services: [
    { name: "Financing", href: "/financing" },
    { name: "Support", href: "/support" },
    { name: "Training", href: "/training" },
    { name: "Consulting", href: "/consulting" },
],
company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
],
legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Sales Policy", href: "/sales-policy" },
],
}
const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
]

export default function Footer(){


  return(
    // <section className="w-full bg-black">
    <footer className="w-full bg-black backdrop-blur-xl border-t border-white/10">
            <div className="container px-4 py-20">
                <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Shop</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Services</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Company</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Legal</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t border-white/10"
                >
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center space-x-8">
                            {socialLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-400 transition-colors hover:text-white"
                                        target="_blank"
                                        // rel="noopener noreferrer"
                                    >
                                        <span className="sr-only">{link.name}</span>
                                        <Icon className="h-6 w-6" />
                                    </Link>
                                )
                            })}
                        </div>
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} sala.lk. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    //  </section>
  )


}






