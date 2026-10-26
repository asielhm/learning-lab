# Heart Lab — Y9 Circulatory System

The platform keeps the body-location illustration and rotatable BodyParts3D heart model, with centering, two-finger panning, pinch zoom and Shift/right-drag for desktop panning.

The **Virtual dissection** navigation step and the **Open Heart Lab dissection** link both open https://asielhm.github.io/heart-lab-y9/ in a new tab. That user-selected page replaces the previous local guided-dissection implementation. Linking directly means future improvements in that separate project are available without copying its code into this repository.

The circulation revision simulator remains at `revision.html`, with its own 60-question bank. Platform breadcrumbs and the revision link remain available in the original tab.

## Scientific model

The source GLB has a combined ventricular-wall mesh and solid cavity surfaces. It does not contain separate valve cusps, chordae, pulmonary veins or inferior vena cava. This viewer is for external anatomy and identification; it does not claim to perform physical cuts. Model attribution and image licensing remain in the repository's `MODEL-ATTRIBUTION.md`.

## Validation

Run the static server from the platform root. Verify body-view interactions, model loading, selection, centering, touch/mouse controls and both replacement-dissection link targets. Check the revision simulator separately. The linked GitHub Pages host cannot be fetched from the cloud network, but its public repository source has been inspected; external-page availability must be distinguished from local viewer tests.
