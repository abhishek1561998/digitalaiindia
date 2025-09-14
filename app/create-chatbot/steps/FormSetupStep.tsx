"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Settings, 
  MessageSquare, 
  User,
  Check,
  AlertCircle,
  Type,
  Mail,
  Phone,
  List,
  Textarea as TextareaIcon,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSetupStepProps {
  config: any;
  updateConfig: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const fieldTypes = [
  { id: 'text', name: 'Text Input', icon: Type, description: 'Single line text' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Email address' },
  { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number' },
  { id: 'select', name: 'Dropdown', icon: List, description: 'Select from options' },
  { id: 'textarea', name: 'Text Area', icon: TextareaIcon, description: 'Multi-line text' },
];

export default function FormSetupStep({
  config,
  updateConfig,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: FormSetupStepProps) {
  const [editingField, setEditingField] = useState<number | null>(null);

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text' as const,
      required: false,
      options: [] as string[],
    };
    
    updateConfig({
      form: {
        ...config.form,
        fields: [...config.form.fields, newField],
      },
    });
    setEditingField(config.form.fields.length);
  };

  const updateField = (index: number, updates: any) => {
    const updatedFields = config.form.fields.map((field: any, i: number) => 
      i === index ? { ...field, ...updates } : field
    );
    
    updateConfig({
      form: {
        ...config.form,
        fields: updatedFields,
      },
    });
  };

  const removeField = (index: number) => {
    const updatedFields = config.form.fields.filter((_: any, i: number) => i !== index);
    updateConfig({
      form: {
        ...config.form,
        fields: updatedFields,
      },
    });
  };

  const updateFormMessage = (field: string, value: string) => {
    updateConfig({
      form: {
        ...config.form,
        [field]: value,
      },
    });
  };

  const updateFormSetting = (field: string, value: boolean) => {
    updateConfig({
      form: {
        ...config.form,
        [field]: value,
      },
    });
  };

  const addOption = (fieldIndex: number) => {
    const field = config.form.fields[fieldIndex];
    const updatedOptions = [...field.options, ''];
    updateField(fieldIndex, { options: updatedOptions });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = config.form.fields[fieldIndex];
    const updatedOptions = field.options.map((opt: string, i: number) => 
      i === optionIndex ? value : opt
    );
    updateField(fieldIndex, { options: updatedOptions });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = config.form.fields[fieldIndex];
    const updatedOptions = field.options.filter((_: string, i: number) => i !== optionIndex);
    updateField(fieldIndex, { options: updatedOptions });
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.id === type);
    return fieldType ? fieldType.icon : Type;
  };

  const isStepComplete = config.form.welcomeMessage.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Setup Forms & Messages
        </h3>
        <p className="text-slate-400">
          Configure how your chatbot interacts with users and collects information
        </p>
      </div>

      {/* Welcome Message */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
          Welcome Message *
        </h4>
        
        <Textarea
          value={config.form.welcomeMessage}
          onChange={(e) => updateFormMessage("welcomeMessage", e.target.value)}
          placeholder="Welcome to our support! How can I help you today?"
          className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-400">
          {config.form.welcomeMessage.length} characters
        </p>
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Check className="w-5 h-5 mr-2 text-cyan-400" />
          Success Message
        </h4>
        
        <Textarea
          value={config.form.successMessage}
          onChange={(e) => updateFormMessage("successMessage", e.target.value)}
          placeholder="Thank you for your message! We'll get back to you soon."
          className="min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-cyan-400" />
            Form Fields
          </h4>
          <Button
            onClick={addField}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
        
        <div className="space-y-3">
          {config.form.fields.map((field: any, index: number) => {
            const FieldIcon = getFieldIcon(field.type);
            const isEditing = editingField === index;
            
            return (
              <div key={field.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FieldIcon className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-medium text-white">
                      Field {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setEditingField(isEditing ? null : index)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                    >
                      {isEditing ? "Done" : "Edit"}
                    </Button>
                    <Button
                      onClick={() => removeField(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    {/* Field Label */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Field Label
                      </label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="e.g., Your Name, Email Address"
                        className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>

                    {/* Field Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Field Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, { type: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.id} value={type.id} className="bg-slate-800">
                            {type.name} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Required Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Required Field</span>
                      <button
                        onClick={() => updateField(index, { required: !field.required })}
                        className="flex items-center space-x-2"
                      >
                        {field.required ? (
                          <ToggleRight className="w-6 h-6 text-cyan-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-300">
                          {field.required ? "Yes" : "No"}
                        </span>
                      </button>
                    </div>

                    {/* Options for Select Fields */}
                    {field.type === 'select' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-slate-300">
                            Options
                          </label>
                          <Button
                            onClick={() => addOption(index)}
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {field.options.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                              />
                              <Button
                                onClick={() => removeOption(index, optionIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{field.label || "Untitled Field"}</span>
                      <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded">
                        {fieldTypes.find(ft => ft.id === field.type)?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Required: {field.required ? "Yes" : "No"}</span>
                      {field.type === 'select' && (
                        <span>Options: {field.options.length}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {config.form.fields.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No form fields added yet</p>
            <p className="text-sm">Click "Add Field" to start collecting user information</p>
          </div>
        )}
      </div>

      {/* Form Settings */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-cyan-400" />
          Form Settings
        </h4>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <div className="text-sm font-medium text-white">Collect User Information</div>
            <div className="text-xs text-slate-400">Automatically collect visitor details</div>
          </div>
          <button
            onClick={() => updateFormSetting("collectUserInfo", !config.form.collectUserInfo)}
            className="flex items-center space-x-2"
          >
            {config.form.collectUserInfo ? (
              <ToggleRight className="w-6 h-6 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
            <span className="text-sm text-slate-300">
              {config.form.collectUserInfo ? "Yes" : "No"}
            </span>
          </button>
        </div>
      </div>

      {/* Form Preview */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-white mb-3">Form Preview</h5>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded text-sm text-slate-300">
            {config.form.welcomeMessage || "Welcome message will appear here..."}
          </div>
          
          {config.form.fields.map((field: any, index: number) => (
            <div key={index} className="p-2 bg-white/5 rounded text-xs text-slate-400">
              <span className="font-medium">{field.label || "Untitled Field"}</span>
              <span className="ml-2 opacity-75">({fieldTypes.find(ft => ft.id === field.type)?.name})</span>
              {field.required && <span className="ml-2 text-red-400">*</span>}
            </div>
          ))}
          
          <div className="p-3 bg-white/5 rounded text-sm text-slate-300">
            {config.form.successMessage || "Success message will appear here..."}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <h5 className="text-sm font-medium text-cyan-400 mb-2">💡 Form Setup Tips</h5>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Keep the welcome message friendly and clear</li>
          <li>• Only add necessary form fields to avoid overwhelming users</li>
          <li>• Use appropriate field types for better user experience</li>
          <li>• Make important fields required to ensure data quality</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div className="flex items-center space-x-2">
          {isStepComplete ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Step Complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Add welcome message to continue</span>
            </>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={!isStepComplete}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
        >
          Continue to Avatar & Voice
        </Button>
      </div>
    </div>
  );
}
