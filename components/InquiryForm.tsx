'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

export default function InquiryForm() {
  const t = useTranslations('form');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus('error');
      setErrorMessage(t('error'));
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        const errorMsg = responseData?.error || responseData?.errors?.[0]?.message || `Error ${response.status}: ${response.statusText}`;
        setErrorMessage(errorMsg);
        console.error('Formspree error:', { status: response.status, data: responseData });
      }
    } catch (error) {
      setStatus('error');
      console.error('Form submission error:', error);
      setErrorMessage(t('error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8 md:p-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('name')}
              <span className="text-red-500 ms-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={t('namePlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
              <span className="text-red-500 ms-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              dir="ltr"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left placeholder:text-left"
              placeholder={t('emailPlaceholder')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            {t('company')}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={t('companyPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            {t('service')}
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              className="w-full py-3 ps-4 pe-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none text-start truncate"
            >
              <option value="">{t('servicePlaceholder')}</option>
              <option value="appDevelopment">{t('serviceOptions.appDevelopment')}</option>
              <option value="webDevelopment">{t('serviceOptions.webDevelopment')}</option>
              <option value="marketingConsulting">{t('serviceOptions.marketingConsulting')}</option>
              <option value="businessIdeaConsulting">{t('serviceOptions.businessIdeaConsulting')}</option>
              <option value="ai">{t('serviceOptions.ai')}</option>
              <option value="other">{t('serviceOptions.other')}</option>
            </select>
            <svg
              className="pointer-events-none absolute inset-y-0 end-3 my-auto h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('message')}
            <span className="text-red-500 ms-1">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder={t('messagePlaceholder')}
          />
        </div>

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {errorMessage || t('error')}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">
              {t('success')}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}

