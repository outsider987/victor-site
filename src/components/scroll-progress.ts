export function scrollProgress(scrollTop: number, offsets: readonly number[]) {
  if (offsets.length < 2 || scrollTop <= offsets[0]) return 0;

  for (let index = 0; index < offsets.length - 1; index += 1) {
    if (scrollTop > offsets[index + 1]) continue;
    const distance = offsets[index + 1] - offsets[index];
    return index + (distance ? (scrollTop - offsets[index]) / distance : 0);
  }

  return offsets.length - 1;
}
