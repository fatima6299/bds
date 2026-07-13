# Images des Produits

Ce dossier contient toutes les images des produits de la boutique BDS BUSINESS. Les images sont organisées par catégorie de produits.

## Structure des dossiers

- `abayas/` : Images pour les abayas
- `men/` : Images pour les vêtements homme
- `computers/` : Images pour les ordinateurs portables et accessoires
- `watches/` : Images pour les montres

## Directives pour les images

1. **Format** : Utilisez des fichiers JPG ou PNG
2. **Taille** : 800x800 pixels (minimum 500x500)
3. **Nommage** : 
   - Utilisez des noms descriptifs en minuscules avec des tirets
   - Exemple : `abaya-noire-brodee-1.jpg`, `costume-bleu-marine-2.jpg`
4. **Qualité** : Optimisez les images pour le web (qualité 70-80% pour JPG)
5. **Aspect** : 
   - Fond blanc ou neutre
   - Bon éclairage
   - Plusieurs angles pour chaque produit

## Exemple de structure

```
images/
└── products/
    ├── abayas/
    │   ├── abaya-noire-brodee-1.jpg
    │   ├── abaya-noire-brodee-2.jpg
    │   └── abaya-bordeaux-doree-1.jpg
    ├── men/
    │   ├── costume-bleu-marine-1.jpg
    │   └── chemise-blanche-1.jpg
    ├── computers/
    │   ├── hp-15s-1.jpg
    │   └── hp-15s-2.jpg
    └── watches/
        └── montre-homme-acier-1.jpg
```

## Mise à jour du catalogue

Lors de l'ajout de nouveaux produits, mettez à jour le fichier `data/products.json` avec les chemins d'accès aux images correspondantes.
