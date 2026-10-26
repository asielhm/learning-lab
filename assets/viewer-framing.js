/** Consistent mouse and touch gestures for the two anatomy viewers. */
export function enableSpecimenGestures(THREE, controls) {
  controls.enablePan = true;
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.screenSpacePanning = true;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
}

/** Fit and visually center a specimen in its canvas, independently of its origin. */
export function centerSpecimen(THREE, camera, controls, specimen, viewport) {
  if (!camera || !controls || !specimen || !viewport.clientWidth || !viewport.clientHeight) return;
  const bounds = new THREE.Box3();
  const point = new THREE.Vector3();
  const vertices = [];
  specimen.updateMatrixWorld(true);
  specimen.traverse(object => {
    if (!object.isMesh || object.userData.helper || !object.visible) return;
    const positions = object.geometry?.attributes.position;
    if (!positions) return;
    for (let index = 0; index < positions.count; index++) {
      point.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld);
      bounds.expandByPoint(point);
      vertices.push(point.x, point.y, point.z);
    }
  });
  if (bounds.isEmpty()) return;
  camera.aspect = viewport.clientWidth / viewport.clientHeight;
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const distance = Math.max(size.y, size.x / camera.aspect) / (2 * tangent) * 1.2 + size.z / 2;
  const damping = controls.enableDamping;
  controls.enableDamping = false;
  controls.update(); // Clear remaining drag momentum before applying the home view.
  controls.maxDistance = Math.max(14, distance * 2);
  controls.target.copy(center);
  camera.up.set(0, 1, 0);
  camera.position.copy(center).add(new THREE.Vector3(0, 0, distance));
  controls.update();
  // A 3D bounds midpoint can appear off-center under perspective. Center the
  // projected silhouette instead, translating camera and orbit target together.
  for (let iteration = 0; iteration < 4; iteration++) {
    camera.updateMatrixWorld(true);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let index = 0; index < vertices.length; index += 3) {
      point.set(vertices[index], vertices[index + 1], vertices[index + 2]).project(camera);
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
    const dx = (minX + maxX) / 2 * distance * tangent * camera.aspect;
    const dy = (minY + maxY) / 2 * distance * tangent;
    camera.position.x += dx; camera.position.y += dy;
    controls.target.x += dx; controls.target.y += dy;
    controls.update();
  }
  controls.enableDamping = damping;
}
