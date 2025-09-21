import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: {} },
    ru: { translation: {} },
  },
  interpolation: { escapeValue: false },
});

describe('LanguageSwitcher with real i18n', () => {
  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

  it('renders the "En" and "Ru" buttons', () => {
    renderComponent();
    expect(screen.getByText('En')).toBeInTheDocument();
    expect(screen.getByText('Ru')).toBeInTheDocument();
  });

  it('changes language when buttons are clicked', () => {
    renderComponent();

    const enButton = screen.getByText('En');
    const ruButton = screen.getByText('Ru');

    fireEvent.click(ruButton);
    expect(i18n.language).toBe('ru');

    fireEvent.click(enButton);
    expect(i18n.language).toBe('en');
  });

  it('highlights the current language button', () => {
    renderComponent();

    const enButton = screen.getByText('En');
    const ruButton = screen.getByText('Ru');

    expect(enButton.className).toContain('activeLanguage');
    expect(ruButton.className).not.toContain('activeLanguage');

    fireEvent.click(ruButton);

    expect(ruButton.className).toContain('activeLanguage');
    expect(enButton.className).not.toContain('activeLanguage');
  });
});
