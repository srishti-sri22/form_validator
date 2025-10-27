import React, { useState, useEffect } from "react";
import "./FormValidationWidget.css"; 

/**
 * FormField Component - Reusable, customizable field
 * @param {Object} props - Field configuration
 */
const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder,
  icon,
  onBlur,
  options = [],
  maxLength,
  min,
  max,
  fieldClassName = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  fieldStyle = {},
  inputStyle = {},
  labelStyle = {},
  errorStyle = {},
  showCharCount = false,
  required = false
}) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (showCharCount && value) {
      setCharCount(value.length);
    }
  }, [value, showCharCount]);

  const renderInput = () => {
    const commonProps = {
      name,
      value,
      onChange,
      onBlur,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      maxLength,
      min,
      max,
      required,
      style: inputStyle,
      className: `form-input ${inputClassName} ${error ? 'error' : ''}`
    };

    switch (type) {
      case "textarea":
  return (
    <div className="input-wrapper">
      <textarea 
        {...commonProps} 
        rows="4" 
        value={value || ""} 
      />
      {showCharCount && maxLength && (
        <span className="char-counter">{charCount}/{maxLength}</span>
      )}
    </div>
  );

case "select":
  return (
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`form-select ${inputClassName} ${error ? "error" : ""}`}
    >
      <option value="">
        {placeholder || `Select ${label.toLowerCase()}`}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

      default:
        return (
          <div className="input-wrapper">
            <input type={type} {...commonProps} />
            {icon && <span className="input-icon">{icon}</span>}
          </div>
        );
    }
  };

  return (
    <div className={`form-field ${fieldClassName}`} style={fieldStyle}>
      <label className={labelClassName} style={labelStyle}>
        {label} {required && <span className="required-star">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className={`error-message ${errorClassName}`} style={errorStyle}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

/**
 * FormValidationWidget - Main Component
 * @param {Object} props - Configuration props
 */
export const FormValidationWidget = ({
 
  fields = [],
  initialValues = {},
  onSubmit,
  onReset,
 
  theme = {},
  darkMode = false,
  containerClassName = "",
  formClassName = "",
  containerStyle = {},
  formStyle = {},
  
  title = "Registration Form",
  titleIcon = "✨",
  subtitle = "Fill in your details",
  showThemeToggle = true,
  showParticles = true,
  showDivider = true,
  
  submitButtonText = "Submit Form",
  resetButtonText = "Reset",
  showResetButton = true,
  submitButtonClassName = "",
  resetButtonClassName = "",
  submitButtonStyle = {},
  resetButtonStyle = {},

  successMessage = "Form submitted successfully!",
  successIcon = "🎉",
  showSuccessMessage = true,
  successDuration = 5000,

  onThemeToggle,
  onFieldChange,
  onValidationError,
  

  enableAnimations = true,
  animationDelay = 0.1
}) => {
  
  const defaultTheme = {
    colors: {
      primary: '#2575fc',
      secondary: '#6a11cb',
      success: '#28a745',
      error: '#ff4d4f',
      text: '#333333',
      textLight: '#555555',
      border: '#e0e0e0',
      background: '#ffffff',
      inputBg: '#ffffff'
    },
    spacing: {
      fieldGap: '20px',
      padding: '14px 16px',
      borderRadius: '12px',
      containerPadding: '50px 60px'
    },
    animation: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    ...theme
  };

  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

 


  const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedValues = { ...formValues, [name]: value };
  setFormValues(updatedValues);

  const field = fields.find((f) => f.name === name);

  if (field && field.validation) {
    const err = field.validation(value, updatedValues);
    setFormErrors((prev) => ({ ...prev, [name]: err }));
  }

  if (onFieldChange) {
    onFieldChange(name, value, updatedValues);
  }
};

const handleBlur = (e) => {
  const { name, value } = e.target;
  const field = fields.find((f) => f.name === name);

  if (field && field.validation) {
    const err = field.validation(value, formValues);
    setFormErrors((prev) => ({ ...prev, [name]: err }));
  }
};


  const validate = (values) => {
    const errors = {};
    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(values[field.name], values);
        if (error) errors[field.name] = error;
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {


  const errors = validate(formValues);
  setFormErrors(errors);

  if (Object.keys(errors).length === 0) {
  setIsSubmit(true);
  setFormValues(" ");
    
  }
};


  const handleReset = () => {
    const resetValues = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {});
    setFormValues(resetValues);
    setFormErrors({});
    setIsSubmit(false);

    if (onReset) {
      onReset();
    }
  };

 useEffect(() => {
  if (!isSubmit) return;

  const noErrors = Object.keys(formErrors).length === 0;

  if (noErrors) {
    
    setIsSubmit(false);

    if (onSubmit) onSubmit(formValues);

    if (showSuccessMessage && successDuration > 0) {
      const timer = setTimeout(() => {}, successDuration);
      return () => clearTimeout(timer);
    }
  }
}, [isSubmit]);


  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (onThemeToggle) {
      onThemeToggle(newMode);
    }
  };

  const themeVars = {
    '--accent-primary': defaultTheme.colors.primary,
    '--accent-secondary': defaultTheme.colors.secondary,
    '--success-color': defaultTheme.colors.success,
    '--error-color': defaultTheme.colors.error,
    '--field-gap': defaultTheme.spacing.fieldGap,
    '--padding': defaultTheme.spacing.padding,
    '--border-radius': defaultTheme.spacing.borderRadius,
    '--container-padding': defaultTheme.spacing.containerPadding,
    '--duration': defaultTheme.animation.duration,
    '--easing': defaultTheme.animation.easing,
    ...containerStyle
  };

  return (
    <div 
      className={`fvw-container ${isDarkMode ? 'dark-mode' : ''} ${containerClassName}`}
      style={themeVars}
    >
    

      {showThemeToggle && (
        <button className="fvw-theme-toggle" onClick={toggleTheme} type="button">
          <span className="fvw-theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
        </button>
      )}

      
      <div className={`fvw-form-container ${formClassName}`} style={formStyle}>
        {title && (
          <>
            <h1 className="fvw-form-title">
              {titleIcon && <span className="fvw-title-icon">{titleIcon}</span>} {title}
            </h1>
            {subtitle && <p className="fvw-form-subtitle">{subtitle}</p>}
          </>
        )}
        
        {showDivider && <div className="fvw-divider"></div>}


        {Object.keys(formErrors).length === 0 && isSubmit && showSuccessMessage && (
          <div className="fvw-success-message">
            {successIcon} {successMessage}
          </div>
        )}

        <div className="fvw-form">
          {fields.map((field, index) => (
            
            <FormField
            key={field.name}
            {...field}
            value={formValues[field.name] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formErrors[field.name]}
            fieldStyle={
                enableAnimations 
                  ? { animationDelay: `${index * animationDelay}s`, ...field.fieldStyle }
                  : field.fieldStyle
              }
/>

          ))}

         
          <div className="fvw-button-group">
            <button 
              type="button"
              onClick={handleSubmit}
              className={`fvw-submit-btn ${submitButtonClassName}`}
              style={submitButtonStyle}
            >
              <span>{submitButtonText}</span>
            </button>
            {showResetButton && (
              <button 
                type="button"
                onClick={handleReset}
                className={`fvw-reset-btn ${resetButtonClassName}`}
                style={resetButtonStyle}
              >
                <span>{resetButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



