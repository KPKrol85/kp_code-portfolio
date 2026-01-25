(() => {
  const storageKey = "cuicp-lang";
  const supported = ["pl", "en"];
  const dict = {
    pl: {
      lang_label: "Jezyk",
      theme_label: "Motyw",
      theme_system: "System",
      theme_light: "Jasny",
      theme_dark: "Ciemny",
      theme_saved: "Motyw zapisany",
      home_title: "Core UI Components Pack",
      home_brand_aria: "Core UI Components Pack - strona glowna",
      home_tagline:
        "Production-ready system UI dla prawdziwych dashboardow.",
      home_subtagline:
        "Tokeny, tryby light/dark i gotowe komponenty do wdrozenia.",
      home_included_packs: "Zawarte paczki",
      home_key_features: "Kluczowe cechy",
      pack_card_title: "Components Pack 01 - Universal",
      pack_card_desc:
        "Czyste, oparte o tokeny komponenty HTML/CSS do dashboardow.",
      pack_card_meta: "Buttons, Forms, Cards, Badges | Jasny/Ciemny",
      pack_card_cta: "Otworz Pack 01",
      feature_token_title: "Tokenowe motywy",
      feature_token_desc: "Semantyczne tokeny utrzymuja spojny light i dark mode.",
      feature_no_deps_title: "Bez zaleznosci",
      feature_no_deps_desc: "Tylko HTML i CSS, bez narzedzi build.",
      feature_prod_title: "Gotowe wzorce",
      feature_prod_desc: "Najczestsze wzorce UI gotowe do produkcji.",
      home_footer_intro: "Uzyj przelacznika motywu lub ustaw",
      home_footer_mid: "na",
      home_footer_outro: "aby podejrzec tryb ciemny.",
      pack_top_back: "<- Powrot na strone glowna",
      pack_top_title: "Components Pack 01 - Universal",
      pack_header_title: "Components Pack 01",
      pack_header_desc: "Gotowe do kopiowania HTML i CSS dla spojnego UI dashboardu.",
      pack_header_note_intro: "Tryb ciemny: ustaw",
      pack_header_note_mid: "na",
      pack_header_note_outro: "aby wymusic tryb ciemny.",
      section_buttons: "Przyciski",
      section_forms: "Formularze",
      section_cards: "Karty",
      section_badges: "Etykiety",
      buttons_desc:
        "Glowne akcje i kontrolki w spojnych rozmiarach i wariantach.",
      forms_desc:
        "Standardowe pola, selecty i przelaczniki z czytelnymi stanami.",
      cards_desc: "Elastyczne powierzchnie na metryki, tresc i CTA.",
      badges_desc: "Kompaktowe etykiety dla metadanych i statusow.",
      docs_examples: "Przyklady",
      docs_states: "Stany",
      label_default: "Domyslny",
      label_sizes: "Rozmiary",
      label_icon: "Ikona",
      label_disabled: "Wylaczony",
      label_focus: "Focus",
      label_error: "Blad",
      label_variants: "Warianty",
      label_inline: "Inline",
      label_tone: "Ton",
      label_interactive: "Interaktywne",
      focus_hint: "Uzyj klawisza Tab, aby zobaczyc focus ring.",
      btn_primary: "Glowny",
      btn_secondary: "Poboczny",
      btn_ghost: "Ghost",
      btn_danger: "Niebezpieczny",
      btn_small: "Maly",
      btn_medium: "Sredni",
      btn_large: "Duzy",
      btn_continue: "Kontynuuj",
      btn_primary_disabled: "Glowny wylaczony",
      btn_secondary_disabled: "Poboczny wylaczony",
      forms_label_input: "Input",
      forms_label_textarea: "Textarea",
      forms_label_select: "Select",
      forms_helper: "Tekst pomocniczy dla tego pola.",
      forms_placeholder_input: "Wpisz tekst",
      forms_placeholder_textarea: "Zostaw wiadomosc",
      forms_select_placeholder: "Wybierz opcje",
      forms_option_one: "Opcja 1",
      forms_option_two: "Opcja 2",
      forms_option_three: "Opcja 3",
      forms_label_error: "Blad pola",
      forms_placeholder_invalid: "Nieprawidlowa wartosc",
      forms_error_required: "To pole jest wymagane.",
      forms_placeholder_disabled: "Wylaczone",
      forms_select_disabled: "Wylaczona lista",
      check_checked: "Zaznaczony checkbox",
      check_unchecked: "Niezaznaczony checkbox",
      check_disabled: "Wylaczony checkbox",
      toggle_on: "Przelacznik wlaczony",
      toggle_off: "Przelacznik wylaczony",
      toggle_disabled: "Przelacznik niedostepny",
      card_revenue: "Przychod",
      card_this_week: "Ten tydzien",
      card_notes: "Notatki",
      card_draft: "Szkic",
      card_notes_p1:
        "Zachowaj tresc krotka i konkretna. Krotkie akapity pomagaja w podsumowaniu.",
      card_notes_p2: "Nastepna aktualizacja planowana na piatek rano.",
      card_delta: "+8% vs zeszly tydzien",
      card_no_data: "Brak danych",
      card_connect: "Podlacz zrodlo, aby zaczac.",
      card_upgrade: "Ulepsz",
      card_starter: "Plan startowy",
      card_upgrade_desc: "Odblokuj zaawansowane komponenty i uklady.",
      card_cta_upgrade: "Ulepsz",
      card_learn_more: "Dowiedz sie wiecej",
      card_interactive_note:
        "Dodaj data-interactive=\"true\", aby wlaczyc delikatny hover.",
      badge_neutral: "Neutralny",
      badge_status: "Status",
      badge_info: "Info",
      badge_warning: "Uwaga",
      badge_small: "Maly",
      badge_medium: "Sredni",
      badge_active: "Aktywny",
      badge_status_label: "Status:",
      badge_tone_note: "Uzyj wariantow status/info/warning dla semantycznego wyroznienia.",
    },
    en: {
      lang_label: "Language",
      theme_label: "Theme",
      theme_system: "System",
      theme_light: "Light",
      theme_dark: "Dark",
      theme_saved: "Theme saved",
      home_title: "Core UI Components Pack",
      home_brand_aria: "Core UI Components Pack - home",
      home_tagline:
        "Production-ready UI system for real dashboards.",
      home_subtagline: "Tokens, light/dark modes, and ready-to-ship components.",
      home_included_packs: "Included Packs",
      home_key_features: "Key Features",
      pack_card_title: "Components Pack 01 - Universal",
      pack_card_desc: "Clean, token-driven HTML/CSS components for dashboards.",
      pack_card_meta: "Buttons, Forms, Cards, Badges | Light/Dark",
      pack_card_cta: "Open Pack 01",
      feature_token_title: "Token-based theming",
      feature_token_desc: "Semantic tokens keep light and dark mode consistent.",
      feature_no_deps_title: "No dependencies",
      feature_no_deps_desc: "Just HTML and CSS, no build tooling required.",
      feature_prod_title: "Production-ready patterns",
      feature_prod_desc: "Common dashboard UI patterns ready to copy and ship.",
      home_footer_intro: "Use the theme toggle or set",
      home_footer_mid: "on",
      home_footer_outro: "to preview dark mode.",
      pack_top_back: "<- Back to Home",
      pack_top_title: "Components Pack 01 - Universal",
      pack_header_title: "Components Pack 01",
      pack_header_desc: "Ready-to-copy HTML and CSS for consistent dashboard UI.",
      pack_header_note_intro: "Dark mode: set",
      pack_header_note_mid: "on",
      pack_header_note_outro: "to force dark mode.",
      section_buttons: "Buttons",
      section_forms: "Forms",
      section_cards: "Cards",
      section_badges: "Badges",
      buttons_desc:
        "Primary actions and inline controls with consistent sizes and variants.",
      forms_desc:
        "Standard inputs, selects, and toggles with clear helper and error states.",
      cards_desc: "Flexible surfaces for metrics, content, and calls to action.",
      badges_desc: "Compact labels for metadata, status, and inline highlights.",
      docs_examples: "Examples",
      docs_states: "States",
      label_default: "Default",
      label_sizes: "Sizes",
      label_icon: "Icon",
      label_disabled: "Disabled",
      label_focus: "Focus",
      label_error: "Error",
      label_variants: "Variants",
      label_inline: "Inline",
      label_tone: "Tone",
      label_interactive: "Interactive",
      focus_hint: "Use Tab to see the focus ring.",
      btn_primary: "Primary",
      btn_secondary: "Secondary",
      btn_ghost: "Ghost",
      btn_danger: "Danger",
      btn_small: "Small",
      btn_medium: "Medium",
      btn_large: "Large",
      btn_continue: "Continue",
      btn_primary_disabled: "Primary Disabled",
      btn_secondary_disabled: "Secondary Disabled",
      forms_label_input: "Input",
      forms_label_textarea: "Textarea",
      forms_label_select: "Select",
      forms_helper: "Helper text for this input.",
      forms_placeholder_input: "Type here",
      forms_placeholder_textarea: "Leave a message",
      forms_select_placeholder: "Choose an option",
      forms_option_one: "Option one",
      forms_option_two: "Option two",
      forms_option_three: "Option three",
      forms_label_error: "Input error",
      forms_placeholder_invalid: "Invalid value",
      forms_error_required: "This field is required.",
      forms_placeholder_disabled: "Disabled",
      forms_select_disabled: "Disabled select",
      check_checked: "Checked checkbox",
      check_unchecked: "Unchecked checkbox",
      check_disabled: "Disabled checkbox",
      toggle_on: "Toggle on",
      toggle_off: "Toggle off",
      toggle_disabled: "Toggle disabled",
      card_revenue: "Revenue",
      card_this_week: "This week",
      card_notes: "Notes",
      card_draft: "Draft",
      card_notes_p1:
        "Keep the content concise and actionable. Use short paragraphs to highlight what matters most.",
      card_notes_p2: "Next update planned for Friday morning.",
      card_delta: "+8% vs last week",
      card_no_data: "No data yet",
      card_connect: "Connect a source to start.",
      card_upgrade: "Upgrade",
      card_starter: "Starter plan",
      card_upgrade_desc: "Unlock advanced components and layouts.",
      card_cta_upgrade: "Upgrade",
      card_learn_more: "Learn more",
      card_interactive_note: "Add data-interactive=\"true\" to enable hover lift.",
      badge_neutral: "Neutral",
      badge_status: "Status",
      badge_info: "Info",
      badge_warning: "Warning",
      badge_small: "Small",
      badge_medium: "Medium",
      badge_active: "Active",
      badge_status_label: "Status:",
      badge_tone_note: "Use status/info/warning variants for semantic emphasis.",
    },
  };

  const getUrlLang = () => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    return supported.includes(lang) ? lang : null;
  };

  const setLanguage = (lang) => {
    const safeLang = supported.includes(lang) ? lang : "pl";
    window.localStorage.setItem(storageKey, safeLang);
    document.documentElement.setAttribute("lang", safeLang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[safeLang][key];
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const raw = el.getAttribute("data-i18n-attr");
      if (!raw) {
        return;
      }

      raw.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((part) => part.trim());
        if (!attr || !key) {
          return;
        }
        const value = dict[safeLang][key];
        if (value !== undefined) {
          el.setAttribute(attr, value);
        }
      });
    });

    document.querySelectorAll("[data-lang]").forEach((button) => {
      const isActive = button.getAttribute("data-lang") === safeLang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (window.cuicpThemeToggleUpdate) {
      window.cuicpThemeToggleUpdate();
    }
  };

  const init = () => {
    const urlLang = getUrlLang();
    const stored = window.localStorage.getItem(storageKey);
    const initial = urlLang || (supported.includes(stored) ? stored : "pl");

    setLanguage(initial);

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang");
        setLanguage(lang);
      });
    });
  };

  init();
})();
