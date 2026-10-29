import { site, url } from './site';
import { ICONS } from '../content.config';

// Decap CMS configuration, shared by /admin/config.yml and the demo data script.
//
// Demo mode ("test-repo" backend) keeps every edit in the visitor's browser memory, so anyone
// can try the admin without an account. Its folder lookup only works with single-segment
// paths ("services", not "src/content/services"), so demo paths drop the prefix.

export const backendName = process.env.CMS_BACKEND || (site.demo ? 'test-repo' : 'github');
export const isDemo = backendName === 'test-repo';
const root = isDemo ? '' : 'src/content/';

const DAYS = [
  { label: 'Lundi', value: 'Monday' }, { label: 'Mardi', value: 'Tuesday' }, { label: 'Mercredi', value: 'Wednesday' },
  { label: 'Jeudi', value: 'Thursday' }, { label: 'Vendredi', value: 'Friday' }, { label: 'Samedi', value: 'Saturday' },
  { label: 'Dimanche', value: 'Sunday' },
];
const ICON_LABELS: Record<(typeof ICONS)[number], string> = {
  'brick-wall': 'Mur de briques', 'paint-roller': 'Rouleau', thermometer: 'Thermomètre', layers: 'Couches',
  hammer: 'Marteau', paintbrush: 'Pinceau', house: 'Maison', ruler: 'Règle',
};

const photo = (label: string, name: string, hint?: string) => ({ label, name, widget: 'image', ...(hint ? { hint } : {}) });
const alt = (name: string) => ({
  label: 'Description de la photo', name, widget: 'string',
  hint: 'Une phrase qui décrit la photo. Google la lit, et les personnes malvoyantes aussi.',
});

export function cmsConfig(siteUrl: URL | undefined) {
  const backend =
    backendName === 'github'
      ? {
          name: 'github',
          repo: process.env.CMS_REPO || 'utilisateur/depot',
          branch: process.env.CMS_BRANCH || 'main',
          ...(process.env.CMS_AUTH_URL ? { base_url: process.env.CMS_AUTH_URL } : {}),
          commit_messages: { create: 'Ajout « {{slug}} »', update: 'Modification « {{slug}} »', delete: 'Suppression « {{slug}} »', uploadMedia: 'Photo {{path}}', deleteMedia: 'Suppression photo {{path}}' },
        }
      : { name: backendName };

  return {
    locale: 'fr',
    backend,
    site_url: siteUrl?.href,
    display_url: siteUrl?.href,
    logo: { src: url('/favicon.svg'), show_in_header: true },
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
    collections: [
      {
        name: 'realisations',
        label: 'Réalisations',
        label_singular: 'réalisation',
        description: 'Vos chantiers terminés. Chaque réalisation a sa page avec ses photos, et apparaît dans la galerie.',
        folder: `${root}realisations`,
        create: true,
        slug: '{{slug}}-{{fields.commune}}',
        extension: 'md',
        format: 'frontmatter',
        summary: '{{title}} · {{commune}} · {{date | date(\'MM/YYYY\')}}',
        sortable_fields: [{ field: 'date', default_sort: 'desc' }, 'title', 'commune'],
        fields: [
          { label: 'Titre', name: 'title', widget: 'string', hint: 'Ex. : Rénovation d’un séjour lumineux' },
          { label: 'Commune', name: 'commune', widget: 'string', hint: 'La ville du chantier : elle aide les gens du coin à vous trouver sur Google.' },
          { label: 'Date de fin du chantier', name: 'date', widget: 'datetime', format: 'YYYY-MM-DD', date_format: 'DD/MM/YYYY', time_format: false },
          { label: 'Prestation', name: 'service', widget: 'relation', collection: 'services', value_field: '{{slug}}', search_fields: ['title'], display_fields: ['title'] },
          { label: 'Résumé', name: 'summary', widget: 'text', hint: 'Une ou deux phrases.' },
          { label: 'Surface', name: 'surface', widget: 'string', required: false, hint: 'Ex. : 42 m²' },
          { label: 'Durée', name: 'duration', widget: 'string', required: false, hint: 'Ex. : 8 jours' },
          photo('Photo principale (après travaux)', 'cover'),
          alt('coverAlt'),
          { label: 'Mettre en avant sur la page d’accueil', name: 'featured', widget: 'boolean', default: false, required: false },
          {
            label: 'Autres photos', name: 'gallery', widget: 'list', required: false, label_singular: 'photo',
            summary: '{{fields.alt}}', fields: [photo('Photo', 'image'), alt('alt')],
          },
          {
            label: 'Photo « avant » (facultatif)', name: 'before', widget: 'object', required: false, collapsed: true,
            fields: [{ ...photo('Photo', 'image'), required: false }, { ...alt('alt'), required: false }],
          },
          { label: 'Récit du chantier', name: 'body', widget: 'markdown', required: false, buttons: ['bold', 'italic', 'link', 'heading-two', 'bulleted-list'], editor_components: [] },
        ],
      },
      {
        name: 'services',
        label: 'Prestations',
        label_singular: 'prestation',
        description: 'Les métiers que vous proposez. Chacun a sa page, optimisée pour Google.',
        folder: `${root}services`,
        create: true,
        slug: '{{title}}',
        extension: 'md',
        format: 'frontmatter',
        sortable_fields: [{ field: 'order', default_sort: 'asc' }, 'title'],
        fields: [
          { label: 'Nom de la prestation', name: 'title', widget: 'string' },
          { label: 'Ordre d’affichage', name: 'order', widget: 'number', value_type: 'int', default: 10, hint: '1 = en premier' },
          { label: 'Icône', name: 'icon', widget: 'select', options: ICONS.map((value) => ({ label: ICON_LABELS[value], value })) },
          { label: 'Résumé', name: 'summary', widget: 'text', hint: 'Deux phrases, affichées sur les cartes.' },
          photo('Photo', 'image'),
          alt('imageAlt'),
          { label: 'Ce que vous réalisez', name: 'points', widget: 'list', field: { label: 'Point', name: 'point', widget: 'string' } },
          { label: 'Texte de la page', name: 'body', widget: 'markdown', buttons: ['bold', 'italic', 'link', 'heading-two', 'bulleted-list'], editor_components: [] },
          { label: 'Titre pour Google', name: 'seoTitle', widget: 'string', required: false, hint: 'Ex. : Peintre en bâtiment à Tours. 60 caractères maximum.' },
          { label: 'Description pour Google', name: 'seoDescription', widget: 'text', required: false, hint: 'Le texte gris sous le titre dans Google. 155 caractères maximum.' },
        ],
      },
      {
        name: 'reglages',
        label: 'Réglages',
        editor: { preview: false },
        files: [
          {
            name: 'accueil',
            label: 'Page d’accueil',
            file: `${root}pages/home.json`,
            fields: [
              { label: 'Titre pour Google', name: 'seoTitle', widget: 'string' },
              { label: 'Description pour Google', name: 'seoDescription', widget: 'text' },
              { label: 'Grand titre', name: 'heroTitle', widget: 'string' },
              { label: 'Texte sous le titre', name: 'heroText', widget: 'text' },
              photo('Grande photo', 'heroImage'),
              alt('heroImageAlt'),
              { label: 'Engagements (4 cases)', name: 'highlights', widget: 'list', max: 4, summary: '{{fields.title}}', fields: [{ label: 'Titre', name: 'title', widget: 'string' }, { label: 'Texte', name: 'text', widget: 'text' }] },
              { label: 'Titre « L’artisan »', name: 'aboutTitle', widget: 'string' },
              { label: 'Texte « L’artisan »', name: 'aboutText', widget: 'markdown', buttons: ['bold', 'italic', 'link'], editor_components: [] },
              photo('Photo « L’artisan »', 'aboutImage'),
              alt('aboutImageAlt'),
              { label: 'Étapes', name: 'steps', widget: 'list', summary: '{{fields.title}}', fields: [{ label: 'Titre', name: 'title', widget: 'string' }, { label: 'Texte', name: 'text', widget: 'text' }] },
              { label: 'Avis clients', name: 'testimonials', widget: 'list', summary: '{{fields.name}} ({{fields.place}})', hint: 'Uniquement de vrais avis, avec l’accord du client.', fields: [{ label: 'Nom', name: 'name', widget: 'string' }, { label: 'Commune', name: 'place', widget: 'string' }, { label: 'Avis', name: 'text', widget: 'text' }] },
              { label: 'Questions fréquentes', name: 'faq', widget: 'list', summary: '{{fields.q}}', fields: [{ label: 'Question', name: 'q', widget: 'string' }, { label: 'Réponse', name: 'a', widget: 'text' }] },
            ],
          },
          {
            name: 'entreprise',
            label: 'Entreprise et contact',
            file: `${root}settings/site.json`,
            fields: [
              { label: 'Nom de l’entreprise', name: 'name', widget: 'string' },
              { label: 'Métier', name: 'trade', widget: 'string', hint: 'Ex. : Plâtrier-peintre' },
              { label: 'Slogan', name: 'tagline', widget: 'string' },
              { label: 'Votre nom', name: 'owner', widget: 'string' },
              { label: 'Téléphone', name: 'phone', widget: 'string', pattern: ['^0[1-9]( ?\\d{2}){4}$', 'Format : 06 12 34 56 78'] },
              { label: 'E-mail', name: 'email', widget: 'string' },
              { label: 'Ville', name: 'city', widget: 'string' },
              { label: 'Code postal', name: 'postalCode', widget: 'string' },
              { label: 'Département', name: 'region', widget: 'string' },
              { label: 'Rue (facultatif)', name: 'street', widget: 'string', required: false },
              { label: 'Afficher la rue sur le site', name: 'showAddress', widget: 'boolean', default: false, hint: 'Laissez décoché si vous travaillez depuis chez vous.' },
              { label: 'Latitude', name: 'lat', widget: 'number', value_type: 'float', hint: 'Clic droit sur votre adresse dans Google Maps : le premier nombre.' },
              { label: 'Longitude', name: 'lng', widget: 'number', value_type: 'float', hint: 'Le second nombre.' },
              { label: 'Rayon d’intervention (km)', name: 'radiusKm', widget: 'number', value_type: 'int' },
              { label: 'Année de création', name: 'founded', widget: 'number', value_type: 'int' },
              { label: 'SIRET', name: 'siret', widget: 'string' },
              { label: 'Assurances', name: 'insurance', widget: 'string' },
              {
                label: 'Horaires', name: 'hours', widget: 'list', summary: '{{fields.label}}',
                fields: [
                  { label: 'Libellé', name: 'label', widget: 'string', hint: 'Ex. : Lundi – vendredi' },
                  { label: 'Jours', name: 'days', widget: 'select', multiple: true, required: false, options: DAYS },
                  { label: 'Ouverture', name: 'opens', widget: 'string', required: false, hint: 'Ex. : 08:00' },
                  { label: 'Fermeture', name: 'closes', widget: 'string', required: false, hint: 'Ex. : 18:00' },
                  { label: 'Remarque', name: 'note', widget: 'string', required: false, hint: 'Ex. : Sur rendez-vous' },
                ],
              },
              { label: 'Communes desservies', name: 'areas', widget: 'list', field: { label: 'Commune', name: 'commune', widget: 'string' } },
              { label: 'Lien de votre fiche Google', name: 'googleBusinessUrl', widget: 'string', required: false },
              {
                label: 'Type d’entreprise pour Google', name: 'schemaType', widget: 'select',
                options: [
                  { label: 'Peintre en bâtiment', value: 'HousePainter' }, { label: 'Entreprise générale du bâtiment', value: 'GeneralContractor' },
                  { label: 'Électricien', value: 'Electrician' }, { label: 'Plombier', value: 'Plumber' },
                  { label: 'Couvreur', value: 'RoofingContractor' }, { label: 'Serrurier', value: 'Locksmith' },
                  { label: 'Autre artisan du bâtiment', value: 'HomeAndConstructionBusiness' },
                ],
              },
              { label: 'Gamme de prix', name: 'priceRange', widget: 'select', options: ['€', '€€', '€€€'] },
              { label: 'Adresse de réception du formulaire', name: 'formEndpoint', widget: 'string', required: false, hint: 'Fournie par Formspree ou Web3Forms. Vide = formulaire en mode démo.' },
              { label: 'Clé du formulaire (Web3Forms)', name: 'formAccessKey', widget: 'string', required: false },
              { label: 'Hébergeur (mentions légales)', name: 'host', widget: 'string' },
              { label: 'Site de démonstration', name: 'demo', widget: 'boolean', default: false },
              { label: 'Crédit (texte)', name: 'creditLabel', widget: 'string', required: false },
              { label: 'Crédit (lien)', name: 'creditUrl', widget: 'string', required: false },
            ],
          },
        ],
      },
    ],
  };
}
