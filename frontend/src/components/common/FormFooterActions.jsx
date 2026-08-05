import React from 'react';
import Button from './Button';

/**
 * FormFooterActions Component
 * Bottom action bar with "Save as Draft" and "Publish Package" or custom buttons
 * @param {Function} onSaveDraft - Handler for draft saving
 * @param {Function} onPublish - Handler for publishing/submitting
 * @param {boolean} submitting - Loading/submitting state flag
 * @param {string} draftLabel - Optional draft button text
 * @param {string} publishLabel - Optional publish button text
 */
export const FormFooterActions = ({
  onSaveDraft,
  onPublish,
  submitting = false,
  draftLabel = 'Save as Draft',
  publishLabel = 'Publish Package',
}) => {
  return (
    <div className="pt-6 border-t border-slate-200/80 flex items-center justify-end gap-3 mt-8">
      {onSaveDraft && (
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={submitting}
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          {draftLabel}
        </Button>
      )}

      <Button
        type="submit"
        variant="solid"
        onClick={onPublish}
        disabled={submitting}
        className="px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-indigo-200"
      >
        {submitting ? 'Processing...' : publishLabel}
      </Button>
    </div>
  );
};

export default FormFooterActions;
