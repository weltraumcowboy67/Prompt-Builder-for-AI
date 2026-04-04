const STORAGE_KEY = 'promptwerk-v3-state';

const commonFields = [
  {
    key: 'goal',
    label: 'Ziel',
    hint: 'Was soll konkret entstehen oder passieren?',
    required: true,
    kind: 'textarea',
    full: true,
    rows: 3
  },
  {
    key: 'topic',
    label: 'Thema',
    hint: 'Worum geht es genau?',
    required: true,
    kind: 'input'
  },
  {
    key: 'audience',
    label: 'Zielgruppe',
    hint: 'Für wen ist das Ergebnis gedacht?',
    required: true,
    kind: 'input'
  },
  {
    key: 'context',
    label: 'Kontext',
    hint: 'Welche Hintergrundinfos muss die KI kennen?',
    required: false,
    kind: 'textarea',
    full: true,
    rows: 3
  },
  {
    key: 'style',
    label: 'Stil / Ton',
    hint: 'Wie soll es wirken oder klingen?',
    required: false,
    kind: 'input'
  },
  {
    key: 'format',
    label: 'Format',
    hint: 'Liste, Tabelle, Markdown, Fließtext, JSON ...',
    required: true,
    kind: 'input'
  },
  {
    key: 'length',
    label: 'Länge / Umfang',
    hint: 'Kurz, ausführlich, feste Wortzahl, Anzahl ...',
    required: false,
    kind: 'input'
  },
  {
    key: 'mustInclude',
    label: 'Muss rein',
    hint: 'Welche Inhalte oder Punkte dürfen nicht fehlen?',
    required: false,
    kind: 'textarea',
    full: true,
    rows: 3
  },
  {
    key: 'constraints',
    label: 'Einschränkungen',
    hint: 'Was soll vermieden oder beachtet werden?',
    required: false,
    kind: 'textarea',
    full: true,
    rows: 3
  }
];

const typeConfig = {
  text: {
    label: 'Text schreiben',
    description:
      'Für E-Mails, Blogposts, Produkttexte, Social Posts, Storys und alles, was sprachlich sauber rausfallen soll.',
    role: 'Du bist ein erfahrener Texter mit klarem Stil und sauberer Struktur.',
    fields: [
      {
        key: 'textType',
        label: 'Textart',
        hint: 'Zum Beispiel E-Mail, Blogpost, Produkttext, Post, Landingpage-Text',
        required: true,
        kind: 'input'
      },
      {
        key: 'intent',
        label: 'Zweck',
        hint: 'Informieren, überzeugen, verkaufen, erklären, unterhalten ...',
        required: false,
        kind: 'input'
      },
      {
        key: 'cta',
        label: 'Call to Action',
        hint: 'Welche Handlung soll am Ende folgen?',
        required: false,
        kind: 'input'
      },
      {
        key: 'referenceStyle',
        label: 'Referenzstil',
        hint: 'Optional: ähnliche Richtung, vergleichbarer Stil, bestimmte Sprachebene',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      }
    ],
    presets: [
      {
        name: 'Begrüßungs-E-Mail',
        description: 'Für neue Kunden, klar und professionell.',
        values: {
          goal: 'Schreibe eine professionelle Begrüßungs-E-Mail für neue Kundinnen und Kunden.',
          topic: 'Onboarding für ein SaaS-Produkt',
          audience: 'Neue Geschäftskunden ohne technisches Vorwissen',
          context: 'Das Produkt hilft Teams beim Projektmanagement und soll schnell verständlich wirken.',
          style: 'Freundlich, klar, professionell',
          format: 'Markdown mit Überschrift und 3 kurzen Abschnitten',
          length: '120 bis 160 Wörter',
          mustInclude: 'Begrüßung, Nutzen im Alltag, nächster Schritt',
          constraints: 'Keine Emojis, keine Floskeln, keine unnötige Werbung',
          textType: 'E-Mail',
          intent: 'Informieren und Vertrauen aufbauen',
          cta: 'Zum ersten Setup-Schritt auffordern',
          referenceStyle: 'Klar, modern und ohne aufgeblasene Marketing-Sprache'
        }
      },
      {
        name: 'Landingpage-Text',
        description: 'Für Hero, Nutzen und klaren CTA.',
        values: {
          goal: 'Schreibe einen starken Hero-Text mit Nutzenargumenten und Call to Action.',
          topic: 'Landingpage für eine KI Prompt Builder Website',
          audience: 'Einsteiger und Technikinteressierte',
          context: 'Die Seite soll erklären, warum strukturierte Prompts bessere Ergebnisse liefern.',
          style: 'Direkt, modern, verständlich',
          format: 'Hero Headline, Subheadline, 3 Nutzenpunkte, CTA',
          length: 'Kurz und punchy',
          mustInclude: 'Klarer Nutzen, einfache Sprache, sofortige Verständlichkeit',
          constraints: 'Keine Buzzwords ohne Inhalt',
          textType: 'Landingpage-Text',
          intent: 'Überzeugen und Aktivierung',
          cta: 'Jetzt Prompt erstellen',
          referenceStyle: 'Moderne Produkt-Webseite mit klarer SaaS-Sprache'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Thema', data.topic);
      pushLine(context, 'Zielgruppe', data.audience);
      pushLine(context, 'Kontext', data.context);

      const requirements = [];
      pushLine(requirements, 'Textart', data.textType);
      pushLine(requirements, 'Ziel', data.goal);
      pushLine(requirements, 'Zweck', data.intent);
      pushLine(requirements, 'Stil', data.style);
      pushLine(requirements, 'Format', data.format);
      pushLine(requirements, 'Länge', data.length);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Call to Action', data.cta);
      pushLine(requirements, 'Referenzstil', data.referenceStyle);
      pushLine(requirements, 'Einschränkungen', data.constraints);

      return {
        role: this.role,
        task: `Schreibe ${withArticle(data.textType, 'einen Text')} zum Thema "${data.topic}".`,
        context,
        requirements,
        output: [
          'Gib direkt das fertige Ergebnis aus.',
          'Keine Meta-Erklärung vorab.',
          'Formuliere sauber, konkret und ohne Leerlauf.'
        ],
        final: 'Das Ergebnis muss direkt verwendbar sein und alle Anforderungen vollständig erfüllen.'
      };
    }
  },

  image: {
    label: 'Bild generieren',
    description:
      'Für Bildprompts mit Motiv, Szene, Stil, Licht, Perspektive und Negativ-Vorgaben.',
    role: 'Du bist ein starker Prompt-Designer für Bildgeneratoren.',
    fields: [
      {
        key: 'motif',
        label: 'Motiv',
        hint: 'Was soll im Zentrum des Bildes stehen?',
        required: true,
        kind: 'input'
      },
      {
        key: 'scene',
        label: 'Szene / Umgebung',
        hint: 'Wo spielt das Ganze? Was passiert dort?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'visualStyle',
        label: 'Bildstil',
        hint: 'Fotorealistisch, Anime, 3D, Ölgemälde, Cinematic ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'composition',
        label: 'Komposition / Perspektive',
        hint: 'Kamerawinkel, Bildaufbau, Vordergrund, Hintergrund ...',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'lighting',
        label: 'Licht / Stimmung',
        hint: 'Golden Hour, Neon, weich, düster, kontrastreich ...',
        required: false,
        kind: 'input'
      },
      {
        key: 'negative',
        label: 'Negativ-Prompt',
        hint: 'Was darf nicht vorkommen?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      }
    ],
    presets: [
      {
        name: 'Cyberpunk Key Visual',
        description: 'Starkes Key Visual für Website oder Poster.',
        values: {
          goal: 'Erstelle einen hochwertigen Bildprompt für ein starkes Key Visual.',
          topic: 'Cyberpunk-Stadt der Zukunft',
          audience: 'Junge Erwachsene zwischen 18 und 30',
          context: 'Das Bild soll wie ein Hero-Visual für eine moderne Website funktionieren.',
          style: 'Episch, modern, cinematic',
          format: 'Klarer Bildprompt mit Hauptprompt und Negativ-Prompt',
          length: 'Detailliert',
          mustInclude: 'Tiefenwirkung, hochwertiges Licht, starke Farbführung',
          constraints: 'Keine billige Stockfoto-Wirkung',
          motif: 'Eine Person in futuristischer Streetwear auf einem Dach',
          scene: 'Neon-Stadt bei Nacht, Reklamen, Tiefe, Skyline im Hintergrund',
          visualStyle: 'Cinematic, halb-realistisch, hochwertiger Concept-Art-Look',
          composition: 'Leichte Untersicht, Person im Vordergrund, Stadt in der Tiefe',
          lighting: 'Kaltes Neonlicht mit warmen Lichtakzenten',
          negative: 'Keine unscharfen Hände, keine Artefakte, keine verwaschenen Gesichter'
        }
      },
      {
        name: 'Produkt-Visual',
        description: 'Sauberer Werbe-Look für ein Produkt.',
        values: {
          goal: 'Erstelle einen Bildprompt für ein modernes Produktbild mit Werbequalität.',
          topic: 'Kabelloser Kopfhörer',
          audience: 'Technikinteressierte Käufer',
          context: 'Das Bild soll hochwertig, sauber und sofort verkaufbar wirken.',
          style: 'Minimalistisch, premium, modern',
          format: 'Detaillierter Bildprompt',
          length: 'Mittel bis detailliert',
          mustInclude: 'Klare Formensprache, Fokus auf Produkt, hochwertiger Look',
          constraints: 'Kein chaotischer Hintergrund',
          motif: 'Kabelloser Over-Ear-Kopfhörer',
          scene: 'Saubere Studio-Umgebung mit dezentem Hintergrund',
          visualStyle: 'Fotorealistisch mit Premium-Produktfotografie-Look',
          composition: 'Zentriert, klare Kanten, leichte Drehung für Tiefe',
          lighting: 'Weiches Studio-Licht mit kontrollierten Highlights',
          negative: 'Keine Hände, keine Kratzer, kein unruhiger Hintergrund'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Thema', data.topic);
      pushLine(context, 'Einsatz', data.context);
      pushLine(context, 'Zielgruppe', data.audience);

      const requirements = [];
      pushLine(requirements, 'Motiv', data.motif);
      pushLine(requirements, 'Szene', data.scene);
      pushLine(requirements, 'Bildstil', data.visualStyle);
      pushLine(requirements, 'Komposition', data.composition);
      pushLine(requirements, 'Licht / Stimmung', data.lighting);
      pushLine(requirements, 'Stilrichtung', data.style);
      pushLine(requirements, 'Format', data.format);
      pushLine(requirements, 'Detailgrad', data.length);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Einschränkungen', data.constraints);

      const output = [
        'Gib zuerst den Hauptprompt aus.',
        data.negative ? 'Danach einen klar getrennten Negativ-Prompt.' : 'Kein zusätzlicher Meta-Text.',
        'Formuliere bildsprachlich konkret und hochwertig.'
      ];

      return {
        role: this.role,
        task: `Erstelle einen hochwertigen Bildprompt zum Thema "${data.topic}".`,
        context,
        requirements,
        output,
        final: data.negative
          ? `Negativ-Prompt berücksichtigen: ${data.negative}`
          : 'Der Prompt muss klar, detailliert und direkt in einem Bildgenerator nutzbar sein.'
      };
    }
  },

  code: {
    label: 'Code erstellen',
    description:
      'Für Webseiten, Skripte, Tools, Komponenten oder kleine Produkte mit klarer technischer Richtung.',
    role: 'Du bist ein erfahrener Softwareentwickler mit Fokus auf sauberen, brauchbaren Code.',
    fields: [
      {
        key: 'language',
        label: 'Sprache',
        hint: 'JavaScript, TypeScript, Python, HTML/CSS/JS ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'stack',
        label: 'Stack / Framework',
        hint: 'React, Vue, Flask, Node, Vanilla ...',
        required: false,
        kind: 'input'
      },
      {
        key: 'scope',
        label: 'Umfang',
        hint: 'Nur Frontend, Fullstack, API, CLI-Tool ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'inputsOutputs',
        label: 'Ein- und Ausgaben',
        hint: 'Was geht rein, was soll rauskommen?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'architecture',
        label: 'Struktur / Architektur',
        hint: 'Mehrere Dateien, Komponenten, Module, API-Struktur ...',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'codeRules',
        label: 'Code-Regeln',
        hint: 'Zum Beispiel kein Framework, sauber kommentiert, modular, responsive ...',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      }
    ],
    presets: [
      {
        name: 'Landingpage',
        description: 'HTML, CSS, JS sauber getrennt.',
        values: {
          goal: 'Erstelle eine moderne, responsive Landingpage mit sauberer Struktur.',
          topic: 'Produktseite für ein digitales Tool',
          audience: 'Nutzer auf Desktop und Smartphone',
          context: 'Die Seite soll modern aussehen und leicht anpassbar sein.',
          style: 'Modern, reduziert, professionell',
          format: 'Getrennte Dateien: index.html, style.css, script.js',
          length: 'Sauber und vollständig',
          mustInclude: 'Hero, Features, CTA, Footer, responsive Layout',
          constraints: 'Keine Frameworks, keine unnötigen Dependencies',
          language: 'HTML, CSS, JavaScript',
          stack: 'Vanilla',
          scope: 'Nur Frontend',
          inputsOutputs: 'Keine Backend-Funktionen, nur statische UI mit kleiner Interaktion',
          architecture: 'Trennung in drei Dateien, gut benannte Klassen und Funktionen',
          codeRules: 'Sauberer Code, gut lesbar, responsive, leicht erweiterbar'
        }
      },
      {
        name: 'Kleines Tool',
        description: 'Lokales Tool mit klarer Logik.',
        values: {
          goal: 'Erstelle ein kleines lokales Tool mit klarer Struktur und brauchbarer UX.',
          topic: 'Prompt Builder Website',
          audience: 'Einsteiger und fortgeschrittene Nutzer',
          context: 'Das Tool soll lokal im Browser laufen und Daten im localStorage behalten.',
          style: 'Pragmatisch, modern, direkt',
          format: 'Mehrere Dateien mit sauberer Trennung',
          length: 'Vollständig, aber nicht aufgebläht',
          mustInclude: 'Persistenz, klare Buttons, gut lesbare Oberfläche',
          constraints: 'Keine schweren Libraries',
          language: 'JavaScript',
          stack: 'Vanilla',
          scope: 'Frontend-Tool',
          inputsOutputs: 'Nutzereingaben erzeugen direkt eine Prompt-Ausgabe',
          architecture: 'Klares State-Handling, modulare Hilfsfunktionen',
          codeRules: 'Keine toten Funktionen, gute Namen, sauberer Ablauf'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Projekt', data.topic);
      pushLine(context, 'Zielgruppe / Nutzung', data.audience);
      pushLine(context, 'Kontext', data.context);

      const requirements = [];
      pushLine(requirements, 'Ziel', data.goal);
      pushLine(requirements, 'Sprache', data.language);
      pushLine(requirements, 'Stack / Framework', data.stack);
      pushLine(requirements, 'Umfang', data.scope);
      pushLine(requirements, 'Ein- und Ausgaben', data.inputsOutputs);
      pushLine(requirements, 'Architektur', data.architecture);
      pushLine(requirements, 'Stil', data.style);
      pushLine(requirements, 'Format', data.format);
      pushLine(requirements, 'Länge', data.length);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Code-Regeln', data.codeRules);
      pushLine(requirements, 'Einschränkungen', data.constraints);

      return {
        role: this.role,
        task: `Erstelle den Code für "${data.topic}".`,
        context,
        requirements,
        output: [
          'Gib direkt nutzbaren Code aus.',
          'Wenn mehrere Dateien sinnvoll sind, trenne sie sauber.',
          'Vermeide lange Vorreden und unnötige Theorie.'
        ],
        final: 'Der Code muss sauber benannt, logisch aufgebaut und direkt weiterverwendbar sein.'
      };
    }
  },

  learning: {
    label: 'Lernen / Erklären',
    description:
      'Für verständliche Erklärungen, Lernhilfen, Schritt-für-Schritt-Aufbau und praxistaugliche Beispiele.',
    role: 'Du bist ein klarer Lehrer, der komplexe Themen verständlich herunterbricht.',
    fields: [
      {
        key: 'level',
        label: 'Niveau',
        hint: 'Anfänger, Fortgeschritten, Experte ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'priorKnowledge',
        label: 'Vorwissen',
        hint: 'Was weiß die Zielgruppe schon?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'explanationMode',
        label: 'Erklärmodus',
        hint: 'Schritt für Schritt, bildhaft, technisch, mit Analogien ...',
        required: false,
        kind: 'input'
      },
      {
        key: 'examples',
        label: 'Beispiele / Analogien',
        hint: 'Welche Art Beispiele helfen?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'learningGoal',
        label: 'Lernziel',
        hint: 'Was soll die Person danach können oder verstehen?',
        required: false,
        kind: 'input'
      }
    ],
    presets: [
      {
        name: 'Einfach erklären',
        description: 'Anfängertauglich und logisch aufgebaut.',
        values: {
          goal: 'Erkläre das Thema klar, verständlich und ohne unnötigen Fachjargon.',
          topic: 'Wie APIs funktionieren',
          audience: 'Anfänger',
          context: 'Die Person kennt Webseiten grob, aber keine Programmierung im Detail.',
          style: 'Einfach, ruhig, klar',
          format: 'Schritt für Schritt mit Beispielen',
          length: 'Kurz bis mittel',
          mustInclude: 'Alltagsbeispiel, einfache Definition, praktischer Nutzen',
          constraints: 'Keine Fachbegriffe ohne Erklärung',
          level: 'Anfänger',
          priorKnowledge: 'Grundverständnis von Internetseiten, aber keine Backend-Kenntnisse',
          explanationMode: 'Schritt für Schritt und bildhaft',
          examples: 'Vergleich mit Restaurant-Bestellung und Lieferung',
          learningGoal: 'Danach grob verstehen, wie Anfragen und Antworten zwischen Systemen laufen'
        }
      },
      {
        name: 'Technisch erklären',
        description: 'Mehr Tiefe, aber noch klar.',
        values: {
          goal: 'Erkläre das Thema technisch sauber, aber weiterhin verständlich.',
          topic: 'HTTP und HTTPS',
          audience: 'Lernende mit etwas Technikinteresse',
          context: 'Die Person kennt Browser, Webseiten und grob den Begriff Server.',
          style: 'Sachlich, klar, strukturiert',
          format: 'Abschnitte mit Beispielen und kurzer Zusammenfassung',
          length: 'Mittel',
          mustInclude: 'Unterschiede, Sicherheitsaspekt, konkrete Beispiele',
          constraints: 'Kein unnötiges Abschweifen',
          level: 'Leicht fortgeschritten',
          priorKnowledge: 'Browser, Webseiten, grundlegende Internetbegriffe',
          explanationMode: 'Logisch und mit klaren Zwischenüberschriften',
          examples: 'Ungeschützter Brief versus versiegelter Brief',
          learningGoal: 'Den Unterschied zwischen HTTP und HTTPS praktisch erklären können'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Thema', data.topic);
      pushLine(context, 'Zielgruppe', data.audience);
      pushLine(context, 'Vorwissen', data.priorKnowledge || data.context);

      const requirements = [];
      pushLine(requirements, 'Ziel', data.goal);
      pushLine(requirements, 'Niveau', data.level);
      pushLine(requirements, 'Erklärmodus', data.explanationMode);
      pushLine(requirements, 'Stil', data.style);
      pushLine(requirements, 'Format', data.format);
      pushLine(requirements, 'Länge', data.length);
      pushLine(requirements, 'Beispiele / Analogien', data.examples);
      pushLine(requirements, 'Lernziel', data.learningGoal);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Einschränkungen', data.constraints);

      return {
        role: this.role,
        task: `Erkläre "${data.topic}" passend zum genannten Niveau.`,
        context,
        requirements,
        output: [
          'Erkläre klar und logisch.',
          'Nutze Beispiele, wenn sie helfen.',
          'Am Ende eine kurze Zusammenfassung oder Merkliste.'
        ],
        final: 'Die Erklärung muss verständlich, sauber aufgebaut und direkt lernbar sein.'
      };
    }
  },

  analysis: {
    label: 'Analyse / Feedback',
    description:
      'Für ehrliche Bewertung, Schwächenanalyse, Kritik, Priorisierung und konkrete Verbesserungen.',
    role: 'Du bist ein kritischer Analyst mit direkter, klarer Sprache.',
    fields: [
      {
        key: 'subjectType',
        label: 'Analyseobjekt',
        hint: 'Text, Konzept, Strategie, Code, Design, Daten ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'criteria',
        label: 'Bewertungskriterien',
        hint: 'Wonach soll bewertet werden?',
        required: true,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'outputStyle',
        label: 'Feedback-Format',
        hint: 'Kurzfazit, Stärken/Schwächen, Prioritätenliste, SWOT ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'rigor',
        label: 'Härtegrad',
        hint: 'Schonend, direkt, hart, schonungslos ...',
        required: false,
        kind: 'input'
      }
    ],
    presets: [
      {
        name: 'Landingpage-Kritik',
        description: 'Klar, direkt, conversion-orientiert.',
        values: {
          goal: 'Analysiere die Qualität und nenne die größten Schwächen zuerst.',
          topic: 'Landingpage für ein digitales Produkt',
          audience: 'Startup-Team',
          context: 'Die Seite soll Leads generieren und Vertrauen aufbauen.',
          style: 'Direkt, kritisch, pragmatisch',
          format: 'Kurzfazit, größte Schwächen, konkrete Verbesserungen',
          length: 'Mittel bis ausführlich',
          mustInclude: 'Prioritäten und konkrete Vorschläge',
          constraints: 'Keine weichgespülten Formulierungen',
          subjectType: 'Landingpage / Struktur / Messaging',
          criteria: 'Klarheit, Nutzenkommunikation, Verständlichkeit, Conversion, Fokus',
          outputStyle: 'Prioritätenliste mit konkreten Verbesserungsvorschlägen',
          rigor: 'Direkt'
        }
      },
      {
        name: 'Idee bewerten',
        description: 'Für Konzepte und Produktideen.',
        values: {
          goal: 'Bewerte die Idee realistisch und ohne Schönreden.',
          topic: 'Neue App-Idee',
          audience: 'Gründer oder Entwickler',
          context: 'Die Idee soll auf Machbarkeit, Nutzen und Schwächen geprüft werden.',
          style: 'Nüchtern, direkt, ehrlich',
          format: 'Stärken, Schwächen, Risiken, nächste Schritte',
          length: 'Mittel',
          mustInclude: 'Größte Risiken und realistische Einschätzung',
          constraints: 'Keine leeren Motivationssätze',
          subjectType: 'Produktidee / Konzept',
          criteria: 'Nutzen, Abgrenzung, Machbarkeit, Zielgruppe, Schwachstellen',
          outputStyle: 'Ehrliches Feedback mit klaren Handlungsoptionen',
          rigor: 'Hart, aber fair'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Thema', data.topic);
      pushLine(context, 'Analyseobjekt', data.subjectType);
      pushLine(context, 'Kontext', data.context);
      pushLine(context, 'Zielgruppe', data.audience);

      const requirements = [];
      pushLine(requirements, 'Analyseziel', data.goal);
      pushLine(requirements, 'Bewertungskriterien', data.criteria);
      pushLine(requirements, 'Feedback-Format', data.outputStyle);
      pushLine(requirements, 'Härtegrad', data.rigor);
      pushLine(requirements, 'Stil', data.style);
      pushLine(requirements, 'Länge', data.length);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Einschränkungen', data.constraints);

      return {
        role: this.role,
        task: `Analysiere "${data.topic}" kritisch und konkret.`,
        context,
        requirements,
        output: [
          'Nenne zuerst die größten Schwächen.',
          'Danach konkrete Verbesserungsvorschläge.',
          'Keine weichgespülten Aussagen.'
        ],
        final: 'Die Analyse muss realistisch, präzise und direkt hilfreich sein.'
      };
    }
  },

  naming: {
    label: 'Sachen nennen',
    description:
      'Für Namen, Ideen, Titel, Begriffe, Kategorien und Vorschläge mit klarer Stilrichtung.',
    role: 'Du bist stark in Naming, Ideenfindung und klaren, brauchbaren Vorschlägen.',
    fields: [
      {
        key: 'itemType',
        label: 'Art der Vorschläge',
        hint: 'Zum Beispiel Markennamen, Titel, Ideen, Begriffe, Kategorien ...',
        required: true,
        kind: 'input'
      },
      {
        key: 'quantity',
        label: 'Anzahl',
        hint: 'Wie viele Vorschläge sollen geliefert werden?',
        required: true,
        kind: 'input'
      },
      {
        key: 'namingStyle',
        label: 'Stilrichtung',
        hint: 'Modern, seriös, düster, kreativ, minimalistisch ...',
        required: false,
        kind: 'input'
      },
      {
        key: 'namingDirection',
        label: 'Richtung / Wirkung',
        hint: 'Welche Wirkung sollen die Vorschläge haben?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      },
      {
        key: 'namingRules',
        label: 'No-Gos / Regeln',
        hint: 'Was soll vermieden werden?',
        required: false,
        kind: 'textarea',
        full: true,
        rows: 3
      }
    ],
    presets: [
      {
        name: 'Markenname',
        description: 'Für Tools, Apps, Webseiten oder Produkte.',
        values: {
          goal: 'Nenne starke, merkbare und brauchbare Namensvorschläge.',
          topic: 'Website zum Erstellen besserer KI-Prompts',
          audience: 'Einsteiger und Technikinteressierte',
          context: 'Der Name soll modern wirken und leicht verständlich sein.',
          style: 'Klar, modern, merkbar',
          format: 'Nummerierte Liste mit kurzer Einordnung',
          length: '10 bis 15 Vorschläge',
          mustInclude: 'Einprägsamkeit und klare Richtung',
          constraints: 'Keine langweiligen Standardnamen',
          itemType: 'Markennamen',
          quantity: '12',
          namingStyle: 'Modern und clean',
          namingDirection: 'Soll wie ein echtes digitales Produkt wirken',
          namingRules: 'Keine extrem langen oder schwer aussprechbaren Namen'
        }
      },
      {
        name: 'Video-Titel',
        description: 'Für Social, YouTube oder Content-Ideen.',
        values: {
          goal: 'Nenne starke Titelideen mit klarer Hook.',
          topic: 'Video über bessere KI-Prompts',
          audience: 'Leute mit Interesse an KI und Produktivität',
          context: 'Die Titel sollen klickbar sein, aber nicht billig wirken.',
          style: 'Klar, modern, spannend',
          format: 'Liste mit kurzer Einordnung pro Titel',
          length: '10 Vorschläge',
          mustInclude: 'Klarer Nutzen und verständliche Formulierung',
          constraints: 'Kein billiger Clickbait',
          itemType: 'Videotitel',
          quantity: '10',
          namingStyle: 'Neugierig machend, aber seriös',
          namingDirection: 'Soll Nutzen und Relevanz sofort vermitteln',
          namingRules: 'Keine reißerischen Übertreibungen'
        }
      }
    ],
    buildSections(data) {
      const context = [];
      pushLine(context, 'Thema', data.topic);
      pushLine(context, 'Zielgruppe', data.audience);
      pushLine(context, 'Kontext', data.context);

      const requirements = [];
      pushLine(requirements, 'Art der Vorschläge', data.itemType);
      pushLine(requirements, 'Anzahl', data.quantity || data.length);
      pushLine(requirements, 'Ziel', data.goal);
      pushLine(requirements, 'Stil', data.style);
      pushLine(requirements, 'Stilrichtung', data.namingStyle);
      pushLine(requirements, 'Richtung / Wirkung', data.namingDirection);
      pushLine(requirements, 'Format', data.format);
      pushLine(requirements, 'Muss rein', data.mustInclude);
      pushLine(requirements, 'Einschränkungen', data.constraints);
      pushLine(requirements, 'Regeln / No-Gos', data.namingRules);

      return {
        role: this.role,
        task: `Nenne ${data.quantity || 'mehrere'} passende ${data.itemType || 'Vorschläge'} zum Thema "${data.topic}".`,
        context,
        requirements,
        output: [
          'Liefere direkt die Vorschläge.',
          'Wenn sinnvoll, kurze Einordnung pro Vorschlag.',
          'Keine generischen Füllvorschläge.'
        ],
        final: 'Die Vorschläge müssen brauchbar, merkbar und passend zur gewünschten Richtung sein.'
      };
    }
  }
};

const appState = {
  type: 'text',
  mode: 'productive',
  fields: {}
};

const tabsEl = document.querySelector('#typeTabs');
const typeTitleEl = document.querySelector('#typeTitle');
const typeDescriptionEl = document.querySelector('#typeDescription');
const presetGridEl = document.querySelector('#presetGrid');
const fieldGridEl = document.querySelector('#fieldGrid');
const progressFillEl = document.querySelector('#progressFill');
const progressTextEl = document.querySelector('#progressText');
const qualityBoxEl = document.querySelector('#qualityBox');
const promptOutputEl = document.querySelector('#promptOutput');
const activeTypeLabelEl = document.querySelector('#activeTypeLabel');
const completionLabelEl = document.querySelector('#completionLabel');
const missingLabelEl = document.querySelector('#missingLabel');
const wordCountEl = document.querySelector('#wordCount');
const charCountEl = document.querySelector('#charCount');
const lineCountEl = document.querySelector('#lineCount');
const outputHintEl = document.querySelector('#outputHint');
const copyButton = document.querySelector('#copyButton');
const improveButton = document.querySelector('#improveButton');
const resetButton = document.querySelector('#resetButton');
const modeButtons = document.querySelectorAll('.mode-button');
const exportButtons = document.querySelectorAll('.export-button');
const chipButtons = document.querySelectorAll('.chip');

function pushLine(target, label, value) {
  if (!value) return;
  target.push(`${label}: ${value}`);
}

function withArticle(value, fallback) {
  return value ? value : fallback;
}

function allFieldsForCurrentType() {
  return [...commonFields, ...typeConfig[appState.type].fields];
}

function requiredFieldsForCurrentType() {
  return allFieldsForCurrentType().filter((field) => field.required);
}

function renderTabs() {
  tabsEl.innerHTML = '';

  Object.entries(typeConfig).forEach(([key, config]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tab-button ${appState.type === key ? 'active' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(appState.type === key));
    button.dataset.type = key;
    button.textContent = config.label;
    button.addEventListener('click', () => {
      appState.type = key;
      render();
    });
    tabsEl.appendChild(button);
  });
}

function renderTypeBox() {
  const config = typeConfig[appState.type];
  typeTitleEl.textContent = config.label;
  typeDescriptionEl.textContent = config.description;
  activeTypeLabelEl.textContent = config.label;
}

function renderPresets() {
  const presets = typeConfig[appState.type].presets;
  presetGridEl.innerHTML = '';

  presets.forEach((preset) => {
    const card = document.createElement('article');
    card.className = 'preset-card';

    const title = document.createElement('h4');
    title.textContent = preset.name;

    const text = document.createElement('p');
    text.textContent = preset.description;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ghost';
    button.textContent = 'Preset laden';
    button.addEventListener('click', () => {
      appState.fields = { ...appState.fields, ...preset.values };
      renderFields();
      refresh();
    });

    card.append(title, text, button);
    presetGridEl.appendChild(card);
  });
}

function createFieldElement(field) {
  const wrapper = document.createElement('div');
  wrapper.className = `field-card ${field.required ? 'required' : ''} ${field.full ? 'full' : ''}`;

  const topline = document.createElement('div');
  topline.className = 'field-topline';

  const label = document.createElement('label');
  label.textContent = field.label;
  label.setAttribute('for', field.key);

  const badge = document.createElement('span');
  badge.className = 'required-badge';
  badge.textContent = 'Pflicht';

  topline.append(label, badge);

  const hint = document.createElement('small');
  hint.textContent = field.hint;

  let input;
  if (field.kind === 'textarea') {
    input = document.createElement('textarea');
    input.rows = field.rows || 3;
  } else {
    input = document.createElement('input');
    input.type = 'text';
  }

  input.id = field.key;
  input.name = field.key;
  input.placeholder = field.required ? 'Pflichtfeld' : 'Optional';
  input.value = appState.fields[field.key] || '';

  input.addEventListener('input', (event) => {
    appState.fields[field.key] = event.target.value.trimStart();
    if (event.target.tagName === 'TEXTAREA') {
      autoResize(event.target);
    }
    refresh();
  });

  wrapper.append(topline, hint, input);

  if (field.kind === 'textarea') {
    requestAnimationFrame(() => autoResize(input));
  }

  return wrapper;
}

function renderFields() {
  fieldGridEl.innerHTML = '';
  allFieldsForCurrentType().forEach((field) => {
    fieldGridEl.appendChild(createFieldElement(field));
  });
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.max(textarea.scrollHeight, 110)}px`;
}

function getCurrentData() {
  return {
    type: appState.type,
    mode: appState.mode,
    ...appState.fields
  };
}

function missingRequiredFields(data) {
  return requiredFieldsForCurrentType().filter((field) => !String(data[field.key] || '').trim());
}

function completionPercent(data) {
  const fields = allFieldsForCurrentType();
  const filledCount = fields.filter((field) => String(data[field.key] || '').trim()).length;
  return Math.round((filledCount / fields.length) * 100);
}

function buildPromptSections(data) {
  return typeConfig[appState.type].buildSections(data);
}

function buildProductivePrompt(sections) {
  const parts = [];

  parts.push('ROLLE');
  parts.push(sections.role);
  parts.push('');
  parts.push('AUFGABE');
  parts.push(sections.task);
  parts.push('');

  if (sections.context.length) {
    parts.push('KONTEXT');
    sections.context.forEach((item) => parts.push(`- ${item}`));
    parts.push('');
  }

  if (sections.requirements.length) {
    parts.push('ANFORDERUNGEN');
    sections.requirements.forEach((item) => parts.push(`- ${item}`));
    parts.push('');
  }

  if (sections.output.length) {
    parts.push('AUSGABE');
    sections.output.forEach((item) => parts.push(`- ${item}`));
    parts.push('');
  }

  parts.push('WICHTIG');
  parts.push(sections.final);

  return parts.join('\n').trim();
}

function buildCompactPrompt(sections) {
  const contextText = sections.context.length ? `Kontext: ${sections.context.join('; ')}.` : '';
  const requirementText = sections.requirements.length
    ? `Anforderungen: ${sections.requirements.join('; ')}.`
    : '';
  const outputText = sections.output.length ? `Ausgabe: ${sections.output.join('; ')}.` : '';

  return [sections.role, sections.task, contextText, requirementText, outputText, sections.final]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function buildStructuredPrompt(sections) {
  const parts = [];

  parts.push(`Rolle:\n${sections.role}`);
  parts.push(`Aufgabe:\n${sections.task}`);

  if (sections.context.length) {
    parts.push(`Kontext:\n${sections.context.map((item) => `- ${item}`).join('\n')}`);
  }

  if (sections.requirements.length) {
    parts.push(`Anforderungen:\n${sections.requirements.map((item) => `- ${item}`).join('\n')}`);
  }

  if (sections.output.length) {
    parts.push(`Ausgabe:\n${sections.output.map((item) => `- ${item}`).join('\n')}`);
  }

  parts.push(`Schlussregel:\n${sections.final}`);

  return parts.join('\n\n').trim();
}

function buildPrompt(data) {
  const sections = buildPromptSections(data);

  if (appState.mode === 'compact') return buildCompactPrompt(sections);
  if (appState.mode === 'structured') return buildStructuredPrompt(sections);
  return buildProductivePrompt(sections);
}

function qualityMessage(data) {
  const missing = missingRequiredFields(data);
  const completion = completionPercent(data);
  const hints = [];

  if (missing.length) {
    hints.push(`<span class="bad">Fehlende Pflichtfelder:</span> ${missing.map((field) => field.label).join(', ')}`);
  }

  if (!data.context) {
    hints.push('Tipp: Mit Kontext rät die KI weniger und trifft den Einsatz besser.');
  }

  if (!data.constraints) {
    hints.push('Tipp: Einschränkungen machen das Ergebnis meist deutlich präziser.');
  }

  if (!data.style) {
    hints.push('Tipp: Stil oder Ton fehlt noch. Gerade bei Text, Analyse und Lernen ist das wichtig.');
  }

  if (!data.mustInclude) {
    hints.push('Tipp: Unter "Muss rein" landen oft die wichtigsten Anforderungen.');
  }

  if (completion >= 85 && missing.length === 0) {
    return '<strong class="ok">Qualität:</strong> Stark. Der Prompt ist klar, vollständig und produktionsnah.';
  }

  if (completion >= 60) {
    return `<strong class="warn">Qualität:</strong> Solide Basis, aber noch nicht scharf genug.<br>${hints.join('<br>')}`;
  }

  return `<strong class="bad">Qualität:</strong> Noch zu offen. So bekommt man schnell generische Antworten.<br>${hints.join('<br>')}`;
}

function updateStats(prompt, data) {
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const chars = prompt.length;
  const lines = prompt ? prompt.split('\n').length : 0;
  const completion = completionPercent(data);
  const missing = missingRequiredFields(data);

  wordCountEl.textContent = String(words);
  charCountEl.textContent = String(chars);
  lineCountEl.textContent = String(lines);

  completionLabelEl.textContent = `${completion}%`;
  missingLabelEl.textContent = String(missing.length);
  progressTextEl.textContent = `${completion}%`;
  progressFillEl.style.width = `${completion}%`;

  outputHintEl.textContent =
    appState.mode === 'productive'
      ? 'Produktiv ist die schärfste Version für echte Nutzung.'
      : appState.mode === 'compact'
      ? 'Kompakt bündelt alles in einem direkten Prompt.'
      : 'Strukturiert ist gut lesbar und leicht weiterzubearbeiten.';
}

function refresh() {
  const data = getCurrentData();
  const prompt = buildPrompt(data);

  promptOutputEl.value = prompt;
  qualityBoxEl.innerHTML = qualityMessage(data);
  updateStats(prompt, data);
  persistState();
}

function renderModeButtons() {
  modeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === appState.mode);
  });
}

function render() {
  renderTabs();
  renderTypeBox();
  renderPresets();
  renderFields();
  renderModeButtons();
  refresh();
}

function mergeFieldValue(fieldName, value) {
  const current = String(appState.fields[fieldName] || '').trim();
  if (!current) {
    appState.fields[fieldName] = value;
  } else if (!current.toLowerCase().includes(value.toLowerCase())) {
    appState.fields[fieldName] = `${current}, ${value}`;
  }
  renderFields();
  refresh();
}

function improvePrompt() {
  const type = appState.type;

  if (!appState.fields.goal || appState.fields.goal.trim().split(/\s+/).length < 5) {
    appState.fields.goal = appState.fields.goal
      ? `${appState.fields.goal} Formuliere das Ergebnis klar, konkret und direkt nutzbar.`
      : 'Erstelle ein klares, direkt nutzbares Ergebnis ohne unnötigen Leerlauf.';
  }

  if (!appState.fields.style) {
    appState.fields.style = 'Klar, direkt und sauber strukturiert';
  }

  if (!appState.fields.format) {
    appState.fields.format = 'Markdown mit klaren Überschriften';
  }

  if (!appState.fields.length) {
    appState.fields.length = 'Kurz bis mittel, aber vollständig';
  }

  if (!appState.fields.constraints) {
    appState.fields.constraints = 'Keine Floskeln, keine unnötigen Wiederholungen, keine irrelevanten Inhalte';
  }

  if (!appState.fields.mustInclude) {
    appState.fields.mustInclude = 'Nur relevante Inhalte mit klarer Struktur';
  }

  if (!appState.fields.context) {
    appState.fields.context = 'Berücksichtige den praktischen Einsatz und liefere ein direkt nutzbares Ergebnis.';
  }

  if (type === 'image' && !appState.fields.negative) {
    appState.fields.negative = 'Keine Artefakte, keine unscharfen Details, keine unpassenden Elemente';
  }

  if (type === 'analysis' && !appState.fields.rigor) {
    appState.fields.rigor = 'Direkt und ehrlich';
  }

  if (type === 'learning' && !appState.fields.examples) {
    appState.fields.examples = 'Nutze einfache Beispiele aus dem Alltag';
  }

  if (type === 'naming' && !appState.fields.quantity) {
    appState.fields.quantity = '10';
  }

  renderFields();
  refresh();
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(promptOutputEl.value);
    const oldText = copyButton.textContent;
    copyButton.textContent = 'Kopiert';
    setTimeout(() => {
      copyButton.textContent = oldText;
    }, 1200);
  } catch {
    const oldText = copyButton.textContent;
    copyButton.textContent = 'Fehler';
    setTimeout(() => {
      copyButton.textContent = oldText;
    }, 1200);
  }
}

function fileBaseName() {
  return `promptwerk-${appState.type}-${appState.mode}`;
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function exportPrompt(format) {
  const data = getCurrentData();
  const prompt = promptOutputEl.value;
  const baseName = fileBaseName();

  if (format === 'txt') {
    downloadFile(prompt, `${baseName}.txt`, 'text/plain;charset=utf-8');
    return;
  }

  if (format === 'md') {
    const md = `# PromptWerk Export\n\n- Typ: ${typeConfig[appState.type].label}\n- Modus: ${appState.mode}\n\n## Prompt\n\n\`\`\`\n${prompt}\n\`\`\`\n`;
    downloadFile(md, `${baseName}.md`, 'text/markdown;charset=utf-8');
    return;
  }

  if (format === 'json') {
    const payload = {
      exportedAt: new Date().toISOString(),
      type: appState.type,
      typeLabel: typeConfig[appState.type].label,
      mode: appState.mode,
      fields: data,
      prompt
    };
    downloadFile(JSON.stringify(payload, null, 2), `${baseName}.json`, 'application/json;charset=utf-8');
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      appState.type = parsed.type && typeConfig[parsed.type] ? parsed.type : 'text';
      appState.mode = ['productive', 'compact', 'structured'].includes(parsed.mode)
        ? parsed.mode
        : 'productive';
      appState.fields = parsed.fields && typeof parsed.fields === 'object' ? parsed.fields : {};
    }
  } catch {
    appState.type = 'text';
    appState.mode = 'productive';
    appState.fields = {};
  }
}

function resetAll() {
  appState.type = 'text';
  appState.mode = 'productive';
  appState.fields = {};
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function bindEvents() {
  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      appState.mode = button.dataset.mode;
      renderModeButtons();
      refresh();
    });
  });

  chipButtons.forEach((button) => {
    button.addEventListener('click', () => {
      mergeFieldValue(button.dataset.target, button.dataset.value);
    });
  });

  copyButton.addEventListener('click', copyPrompt);
  improveButton.addEventListener('click', improvePrompt);
  resetButton.addEventListener('click', resetAll);

  exportButtons.forEach((button) => {
    button.addEventListener('click', () => exportPrompt(button.dataset.export));
  });
}

restoreState();
bindEvents();
render();
