export type SponsorsOnlyBadgeRenderer = {
  label: {
    "accessibility": {
      "accessibilityData": {
        "label": `Visible to:\n${StringOfTextSeperatedByNewline | 'All channel members'}`
      }
    }
  }
};

export function getVisibleMembershipLevels(data: SponsorsOnlyBadgeRenderer) {
  const [_, ...levels] = data.label.accessibility.accessibilityData.label
    .split('\n');
  if (levels.length === 1 && levels[0] === 'All channel members')
    return [];
  return levels;
}

type StringOfTextSeperatedByNewline = string;
