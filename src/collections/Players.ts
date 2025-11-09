import type { CollectionConfig } from "payload";

export const Players: CollectionConfig = {
  slug: "players",
  timestamps: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "updatedAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Tank", value: "tank" },
        { label: "Support", value: "support" },
        { label: "Damage", value: "damage" },
      ],
      required: true,
    },
  ],
};
