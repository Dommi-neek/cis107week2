// app/contact/page.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cell: '',
    comment: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    cell: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Email validation function
    const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

  // Cell phone validation function (supports US format: 123-456-7890, (123) 456-7890, 1234567890, +1 1234567890)
  const validateCellPhone = (phone: string): boolean => {
  // Normalize: remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle optional country code
  const normalized =
    digits.length === 11 && digits.startsWith('1')
      ? digits.slice(1)
      : digits;

  // Must be exactly 10 digits
  if (normalized.length !== 10) return false;

  // Enforce realistic US rules (area code & exchange can't start with 0 or 1)
  const phoneRegex = /^[2-9]\d{2}[2-9]\d{6}$/;

  return phoneRegex.test(normalized);
};

  // Format phone number for better UX (optional auto-formatting)
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-format phone number as user types
    if (name === 'cell') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for the field being edited
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
    if (name === 'cell') {
      setErrors((prev) => ({ ...prev, cell: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', cell: '' };
    let isValid = true;

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      isValid = false;
    }

    if (formData.cell && !validateCellPhone(formData.cell)) {
      newErrors.cell = 'Please enter a valid 10-digit phone number (e.g., (555) 123-4567 or 5551234567)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Simulate API call (replace with your actual endpoint)
    try {
      // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      
      console.log('Form submitted:', formData);
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We\'ll get back to you soon.',
      });
      
      // Reset form after successful submission
      setFormData({ name: '', email: '', cell: '', comment: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Cell Phone Field */}
              <div>
                <label htmlFor="cell" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cell Phone
                </label>
                <input
                  type="tel"
                  id="cell"
                  name="cell"
                  value={formData.cell}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.cell ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.cell && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.cell}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: 10-digit US number (e.g., 5551234567 or (555) 123-4567)
                </p>
              </div>

              {/* Comment Field */}
              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment / Message *
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  required
                  rows={5}
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="Please share your questions or feedback here..."
                />
              </div>

              {/* Submit Button & Status */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {submitStatus.type && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-800">Visit Us</p>
                  <p className="text-sm">123 Business Ave<br />Suite 100<br />San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-semibold text-gray-800">Call Us</p>
                  <p className="text-sm">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-semibold text-gray-800">Email Us</p>
                  <p className="text-sm">hello@businesscard.com</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-100">
              <p className="text-xs text-gray-500">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}