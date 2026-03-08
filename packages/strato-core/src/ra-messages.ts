/*
This file contains a subset of react-admin messages used by ra-core directly.

Some translations have issues in languages with gender and case. There's no easy fix for this. We cannot interpolate the resource name in a message like "Delete {name}" and expect it to be grammatically correct in all languages.

A workaround requires the translator to torture the phrase in order to place the interpolated variable in nominative case.
Message with translation issues are marked with a comment starting with "Translation issue".
*/
import { defineMessage } from 'react-intl';

defineMessage({
  id: 'ra.action.add',
  defaultMessage: 'Add',
  description: 'Label for the button to add a new record',
});

defineMessage({
  id: 'ra.action.cancel',
  defaultMessage: 'Cancel',
  description: 'Label for the button to cancel an action',
});

defineMessage({
  id: 'ra.action.clear_array_input',
  defaultMessage: 'Clear the list',
  description: 'Label for the button to clear an array input',
});

defineMessage({
  id: 'ra.action.close',
  defaultMessage: 'Close',
  description: 'Label for the button to close a dialog or panel',
});

defineMessage({
  id: 'ra.action.confirm',
  defaultMessage: 'Confirm',
  description: 'Label for the button to confirm an action',
});

defineMessage({
  id: 'ra.action.create',
  defaultMessage: 'Create',
  description: 'Label for the button to create a new record',
});

defineMessage({
  id: 'ra.action.delete',
  defaultMessage: 'Delete',
  description: 'Label for the button to delete one or more records',
});

defineMessage({
  id: 'ra.action.edit',
  defaultMessage: 'Edit',
  description: 'Label for the button to edit a record',
});

defineMessage({
  id: 'ra.action.move_down',
  defaultMessage: 'Move down',
  description: 'Label for the button to move an item down in a list',
});

defineMessage({
  id: 'ra.action.move_up',
  defaultMessage: 'Move up',
  description: 'Label for the button to move an item up in a list',
});

defineMessage({
  id: 'ra.action.refresh',
  defaultMessage: 'Refresh',
  description: 'Label for the button to refresh the current view',
});

defineMessage({
  id: 'ra.action.remove',
  defaultMessage: 'Remove',
  description: 'Label for the button to remove an item',
});

defineMessage({
  id: 'ra.action.save',
  defaultMessage: 'Save',
  description: 'Label for the button to save changes',
});

defineMessage({
  id: 'ra.action.undo',
  defaultMessage: 'Undo',
  description: 'Label for the button to undo the last action',
});

defineMessage({
  id: 'ra.action.update',
  defaultMessage: 'Update',
  description: 'Label for the button to update a record',
});

defineMessage({
  id: 'ra.auth.auth_check_error',
  defaultMessage: 'Please login to continue',
  description: 'Message shown when the user needs to login',
});

defineMessage({
  id: 'ra.input.references.all_missing',
  defaultMessage: 'Unable to find references data.',
  description: 'Error message when all references are missing',
});

defineMessage({
  id: 'ra.input.references.many_missing',
  defaultMessage: 'At least one of the associated references no longer appears to be available.',
  description: 'Error message when many references are missing',
});

defineMessage({
  id: 'ra.input.references.single_missing',
  defaultMessage: 'Associated reference no longer appears to be available.',
  description: 'Error message when a single reference is missing',
});

defineMessage({
  id: 'ra.message.clear_array_input',
  defaultMessage: 'Are you sure you want to clear the whole list?',
  description: 'Confirmation message when clearing an array input',
});

// Translation issue: {name} gender must agree with "this" (e.g., ce/cette, этот/эту).
defineMessage({
  id: 'ra.message.delete_content',
  defaultMessage: 'Are you sure you want to delete this {name}?',
  description: 'Confirmation message when deleting a record',
});

// Translation issue: {name} might require the Accusative case (e.g., Delete "Usera").
defineMessage({
  id: 'ra.message.delete_title',
  defaultMessage: 'Delete {name} {recordRepresentation}',
  description: 'Title for the delete confirmation dialog',
});

defineMessage({
  id: 'ra.message.invalid_form',
  defaultMessage: 'The form is not valid. Please check for errors',
  description: 'Error message shown when a form is invalid',
});

defineMessage({
  id: 'ra.message.select_all_limit_reached',
  defaultMessage: `
    {max, plural,
        one {There are too many elements to select them all. Only the first element was selected.}
        other {There are too many elements to select them all. Only the first # elements were selected.}
    }`,
  description: 'Message shown when select all reaches its limit',
});

defineMessage({
  id: 'ra.message.unsaved_changes',
  defaultMessage: "Some of your changes weren't saved. Are you sure you want to ignore them?",
  description: 'Confirmation message when leaving a page with unsaved changes',
});

// Translation issue: "update {name}" may require Accusative case; "these" must agree with gender of "items".
defineMessage({
  id: 'ra.message.update_content',
  defaultMessage:
    '{smart_count, plural, one {Are you sure you want to update {name} {recordRepresentation}?} other {Are you sure you want to update these # items?}}',
  description: 'Confirmation message when updating one or more records',
});

// Translation issue: {name} might require the Accusative case (e.g., Update "Usera").
defineMessage({
  id: 'ra.message.update_title',
  defaultMessage: '{smart_count, plural, one {Update {name} {recordRepresentation}} other {Update # {name}}}',
  description: 'Title for the update confirmation dialog',
});

defineMessage({
  id: 'ra.navigation.next',
  defaultMessage: 'Go to next page',
  description: 'Label for the button to go to the next page',
});

defineMessage({
  id: 'ra.navigation.page',
  defaultMessage: 'Go to page {page}',
  description: 'Label for the button to go to a specific page',
});

defineMessage({
  id: 'ra.navigation.page_range_info',
  defaultMessage: '{offsetBegin}-{offsetEnd} of {total}',
  description: 'Message showing the current page range and total number of records',
});

defineMessage({
  id: 'ra.navigation.previous',
  defaultMessage: 'Go to previous page',
  description: 'Label for the button to go to the previous page',
});

defineMessage({
  id: 'ra.notification.created',
  defaultMessage: 'Element created',
  description: 'Notification shown when a record is successfully created',
});

defineMessage({
  id: 'ra.notification.data_provider_error',
  defaultMessage: 'dataProvider error. Check the console for details.',
  description: 'Notification shown when a dataProvider error occurs',
});

defineMessage({
  id: 'ra.notification.deleted',
  defaultMessage: '{smart_count, plural, one {Element deleted} other {# elements deleted}}',
  description: 'Notification shown when one or more records are successfully deleted',
});

defineMessage({
  id: 'ra.notification.http_error',
  defaultMessage: 'Server communication error',
  description: 'Notification shown when an HTTP error occurs',
});

defineMessage({
  id: 'ra.notification.item_doesnt_exist',
  defaultMessage: 'Element does not exist',
  description: 'Notification shown when a record does not exist',
});

defineMessage({
  id: 'ra.notification.logged_out',
  defaultMessage: 'Your session has ended, please reconnect.',
  description: 'Notification shown when the user is logged out',
});

defineMessage({
  id: 'ra.notification.not_authorized',
  defaultMessage: "You're not authorized to access this resource.",
  description: 'Notification shown when the user is not authorized',
});

defineMessage({
  id: 'ra.notification.updated',
  defaultMessage: '{smart_count, plural, one {Element updated} other {# elements updated}}',
  description: 'Notification shown when one or more records are successfully updated',
});

// Translation issue: {name} might require the Accusative case (e.g., Create "Usera").
defineMessage({
  id: 'ra.page.create',
  defaultMessage: 'Create {name}',
  description: 'Title for the record creation page',
});

defineMessage({
  id: 'ra.page.edit',
  defaultMessage: '{name} {recordRepresentation}',
  description: 'Title for the record edition page',
});

defineMessage({
  id: 'ra.page.list',
  defaultMessage: '{name}',
  description: 'Title for the record list page',
});

defineMessage({
  id: 'ra.page.show',
  defaultMessage: '{name} {recordRepresentation}',
  description: 'Title for the record show page',
});

defineMessage({
  id: 'ra.validation.email',
  defaultMessage: 'Must be a valid email',
  description: 'Validation error message for email inputs',
});

defineMessage({
  id: 'ra.validation.maxLength',
  defaultMessage: '{max, plural, one {Must be # character or less} other {Must be # characters or less}}',
  description: 'Validation error message for maxLength',
});

defineMessage({
  id: 'ra.validation.maxValue',
  defaultMessage: '{max, plural, other {Must be # or less}}',
  description: 'Validation error message for maxValue',
});

defineMessage({
  id: 'ra.validation.minLength',
  defaultMessage: '{min, plural, one {Must be # character at least} other {Must be # characters at least}}',
  description: 'Validation error message for minLength',
});

defineMessage({
  id: 'ra.validation.minValue',
  defaultMessage: '{min, plural, other {Must be at least #}}',
  description: 'Validation error message for minValue',
});

defineMessage({
  id: 'ra.validation.number',
  defaultMessage: 'Must be a number',
  description: 'Validation error message for number inputs',
});

defineMessage({
  id: 'ra.validation.oneOf',
  defaultMessage: 'Must be one of: {options}',
  description: 'Validation error message for oneOf',
});

defineMessage({
  id: 'ra.validation.regex',
  defaultMessage: 'Must match a specific format (regexp): {pattern}',
  description: 'Validation error message for regex',
});

defineMessage({
  id: 'ra.validation.required',
  defaultMessage: 'Required',
  description: 'Validation error message for required inputs',
});

defineMessage({
  id: 'ra.validation.unique',
  defaultMessage: 'Must be unique',
  description: 'Validation error message for unique inputs',
});
