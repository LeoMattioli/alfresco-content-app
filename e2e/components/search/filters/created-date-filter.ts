/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ElementFinder, by, protractor } from 'protractor';
import { GenericFilterPanel } from './generic-filter-panel';
import { Utils } from '../../../utilities/utils';

export class CreatedDateFilter extends GenericFilterPanel {
  constructor() {
    super('Created date');
  }

  fromField: ElementFinder = this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'From'));
  fromInput: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-input']`));
  fromFieldError: ElementFinder = this.fromField.element(by.css(`[data-automation-id='date-range-from-error']`));
  toField: ElementFinder = this.panelExpanded.element(by.cssContainingText('.adf-search-date-range .mat-form-field', 'To'));
  toInput: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-input']`))
  toFieldError: ElementFinder = this.toField.element(by.css(`[data-automation-id='date-range-to-error']`))
  clearButton: ElementFinder = this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-clear-btn"]'));
  applyButton: ElementFinder = this.panel.element(by.css('.adf-facet-buttons [data-automation-id="date-range-apply-btn"]'));

  async isFromFieldDisplayed(): Promise<boolean> {
    return (await this.fromField.isPresent()) && (await this.fromField.isDisplayed());
  }

  async isFromErrorDisplayed(): Promise<boolean> {
    return (await this.fromFieldError.isPresent()) && (await this.fromFieldError.isDisplayed());
  }

  async isToFieldDisplayed(): Promise<boolean> {
    return (await this.toField.isPresent()) && (await this.toField.isDisplayed());
  }

  async isToErrorDisplayed(): Promise<boolean> {
    return (await this.toFieldError.isPresent()) && (await this.toFieldError.isDisplayed());
  }

  async isClearButtonEnabled(): Promise<boolean> {
    return await this.clearButton.isEnabled();
  }

  async isApplyButtonEnabled(): Promise<boolean> {
    return await this.applyButton.isEnabled();
  }

  async clickClearButton(): Promise<void> {
    if ( await this.isClearButtonEnabled() ) {
      await this.clearButton.click();
    }
  }

  async clickApplyButton(): Promise<void> {
    if ( await this.isApplyButtonEnabled() ) {
      await this.applyButton.click();
    }
  }

  async getFromValue(): Promise<string> {
    try {
      const value = await this.fromInput.getAttribute('value');
      return value;
    } catch (error) {
      return '';
    }
  }

  async getFromError(): Promise<string> {
    try {
      const error = await this.fromFieldError.getText();
      return error;
    } catch (err) {
      return '';
    }
  }

  async getToValue(): Promise<string> {
    try {
      const value = await this.toInput.getAttribute('value');
      return value;
    } catch (err) {
      return '';
    }
  }

  async getToError(): Promise<string> {
    try {
      const error = await this.toFieldError.getText();
      return error;
    } catch (err) {
      return '';
    }
  }

  async resetPanel(): Promise<void> {
    const fromValue = await this.getFromValue();
    const toValue = await this.getToValue();
    if ( fromValue.length > 0 || toValue.length > 0 ) {
      await this.expandPanel();
      await this.clickClearButton();
      await this.collapsePanel();
    }
  }

  async enterFromDate(date: string): Promise<void> {
    await this.expandPanel();
    await Utils.clearFieldWithBackspace(this.fromInput);
    await this.fromInput.sendKeys(date, protractor.Key.TAB);
  }

  async enterToDate(date: string): Promise<void> {
    await this.expandPanel();
    await Utils.clearFieldWithBackspace(this.toInput);
    await this.toInput.sendKeys(date, protractor.Key.TAB);
  }
}
