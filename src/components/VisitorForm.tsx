import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { Visitor, CreateVisitorDTO } from '@/types/visitor';
import { useTheme } from '@/hooks/useTheme';

interface VisitorFormProps {
  initialData?: Visitor;
  onSubmit: (data: CreateVisitorDTO) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Add type guard for Timestamp
const isTimestamp = (value: unknown): value is Timestamp => {
  return value !== null && 
         typeof value === 'object' && 
         value !== undefined && 
         'toDate' in value && 
         typeof (value as Timestamp).toDate === 'function';
};

export const VisitorForm: React.FC<VisitorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Omit<Visitor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    institution: initialData?.institution || '',
    guestCategory: initialData?.guestCategory || 'regular',
    checkIn: initialData?.checkIn || new Date(),
    keperluan: initialData?.keperluan || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { inputTextColor, inputBgColor, inputBorderColor, inputFocusBorderColor } = useTheme();

  // Helper function to safely convert to Date
  const toDate = (date: Date | Timestamp | string): Date => {
    if (date instanceof Date) return date;
    if (isTimestamp(date)) return date.toDate();
    return new Date(date);
  };

  // Initialize form with initialData if in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        email: initialData.email,
        institution: initialData.institution,
        guestCategory: initialData.guestCategory,
        checkIn: initialData.checkIn,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCategory' ? value as 'regular' | 'vip' : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      checkIn: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await onSubmit({
        ...formData,
        checkIn: toDate(formData.checkIn)
      });
      
      // Reset form after successful submission if not in edit mode
      if (!initialData) {
        setFormData({
          fullName: '',
          email: '',
          institution: '',
          guestCategory: 'regular',
          checkIn: new Date(),
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.fullName ? 'border-red-500' : inputBorderColor
          } shadow-sm focus:ring-blue-500 sm:text-sm p-2 ${inputTextColor} ${inputBgColor} ${
            errors.fullName ? 'focus:border-red-500' : inputFocusBorderColor
          }`}
          placeholder="Enter full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="keperluan" className="block text-sm font-medium text-gray-700">
          Keperluan
        </label>
        <input
          type="text"
          id="keperluan"
          name="keperluan"
          value={formData.keperluan || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${inputBorderColor} shadow-sm focus:ring-blue-500 sm:text-sm p-2 ${inputTextColor} ${inputBgColor} ${inputFocusBorderColor}`}
          placeholder="Contoh: Bekerja, Meeting, Kunjungan, dll."
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? 'border-red-500' : inputBorderColor
          } shadow-sm focus:ring-blue-500 sm:text-sm p-2 ${inputTextColor} ${inputBgColor} ${
            errors.email ? 'focus:border-red-500' : inputFocusBorderColor
          }`}
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
          Institution *
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.institution ? 'border-red-500' : inputBorderColor
          } shadow-sm focus:ring-blue-500 sm:text-sm p-2 ${inputTextColor} ${inputBgColor} ${
            errors.institution ? 'focus:border-red-500' : inputFocusBorderColor
          }`}
          placeholder="Enter institution"
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
        )}
      </div>

      <div>
        <label htmlFor="guestCategory" className="block text-sm font-medium text-gray-700">
          Guest Category
        </label>
        <select
          id="guestCategory"
          name="guestCategory"
          value={formData.guestCategory}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${inputBorderColor} py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputTextColor} ${inputBgColor} ${inputFocusBorderColor}`}
        >
          <option value="regular">Regular</option>
          <option value="vip">VIP</option>
        </select>
      </div>

      <div>
        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
          Check-in Date & Time
        </label>
        <input
          type="datetime-local"
          id="checkIn"
          name="checkIn"
          value={toDate(formData.checkIn).toISOString().slice(0, 16)}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          className={`mt-1 block w-full rounded-md border ${inputBorderColor} shadow-sm focus:ring-blue-500 sm:text-sm p-2 ${inputTextColor} ${inputBgColor} ${inputFocusBorderColor}`}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {initialData ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>{initialData ? 'Update Visitor' : 'Add Visitor'}</>
          )}
        </button>
      </div>
    </form>
  );
};
