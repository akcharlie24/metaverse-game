import z from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should atleast be 3 characters" }),

  // TODO: can add password criteria later on
  password: z
    .string()
    .min(6, { message: "Password should atleast be 6 characters" }),

  type: z.enum(["user", "admin"], {
    message: "Invalid role",
  }),
});

export const SignInSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should atleast be 3 characters" }),

  password: z
    .string()
    .min(6, { message: "Password should atleast be 6 characters" }),
});

export const CreateAvatarSchema = z.object({
  imageUrl: z.string().min(1),
  name: z
    .string()
    .min(3, { message: "Name should be atleast of 3 characters" }),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string().min(1),
});

export const CreateSpaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name should be atleast of 3 characters" }),

  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/, {
    message:
      "Please enter dimensions in the format : AAAAxBBBB or lower , eg : 666x555 , 4000x8000 etc. ",
  }),

  mapId: z
    .string()
    .min(1, { message: "Enter a valid MapId or remove the MapId Key" })
    .optional(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string().min(1),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const AddElementSchema = z.object({
  elementId: z.string().min(1),
  spaceId: z.string().min(1),
  x: z.number(),
  y: z.number(),
});

export const DeleteElementSchema = z.object({
  id: z.string().min(1),
});

export const UpdateElementSchema = z.object({
  imageUrl: z.string().min(1),
});

const ElementSchema = z.object({
  elementId: z.string().min(1),
  x: z.number(),
  y: z.number(),
});

export const CreateMapSchema = z.object({
  thumbnail: z.string().min(1),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/, {
    message:
      "Please enter dimensions in the format : AAAAxBBBB or lower , eg : 666x555 , 4000x8000 etc. ",
  }),
  name: z
    .string()
    .min(3, { message: "Map should have a name of atleast 3 elements" }),
  defaultElements: z.array(ElementSchema),
});
