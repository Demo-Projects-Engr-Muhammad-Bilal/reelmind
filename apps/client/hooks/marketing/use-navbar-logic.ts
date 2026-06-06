"use client";
import { useState, useEffect, useRef } from "react";

export const useNavbarLogic = () => {
          const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
          const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
          const [isNotificationOpen, setIsNotificationOpen] = useState(false);
          const [isScrolled, setIsScrolled] = useState(false);
          const [activeSection, setActiveSection] = useState("");

          const dropdownRef = useRef<HTMLDivElement>(null);
          const notificationRef = useRef<HTMLDivElement>(null);

          useEffect(() => {
                    const handleScroll = () => setIsScrolled(window.scrollY > 20);
                    window.addEventListener("scroll", handleScroll);
                    return () => window.removeEventListener("scroll", handleScroll);
          }, []);

          useEffect(() => {
                    const observer = new IntersectionObserver(
                              (entries) => {
                                        entries.forEach((entry) => {
                                                  if (entry.isIntersecting) setActiveSection(entry.target.id);
                                        });
                              },
                              { rootMargin: "-40% 0px -40% 0px" }
                    );
                    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
                    return () => observer.disconnect();
          }, []);

          const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
                    if (href.startsWith('#')) {
                              e.preventDefault();
                              const elem = document.getElementById(href.substring(1));
                              if (elem) {
                                        window.scrollTo({ top: elem.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
                                        setActiveSection(href.substring(1));
                              }
                              setIsMobileMenuOpen(false);
                    }
          };

          useEffect(() => {
                    const handleClickOutside = (event: MouseEvent) => {
                              const target = event.target as Node;
                              if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsProfileDropdownOpen(false);
                              if (notificationRef.current && !notificationRef.current.contains(target)) setIsNotificationOpen(false);
                    };
                    document.addEventListener("mousedown", handleClickOutside);
                    return () => document.removeEventListener("mousedown", handleClickOutside);
          }, []);

          return {
                    states: { isMobileMenuOpen, isProfileDropdownOpen, isNotificationOpen, isScrolled, activeSection },
                    setters: { setIsMobileMenuOpen, setIsProfileDropdownOpen, setIsNotificationOpen },
                    refs: { dropdownRef, notificationRef },
                    handleNavClick
          };
};