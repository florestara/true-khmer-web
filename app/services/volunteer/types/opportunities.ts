import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import * as z from "zod";
import { PaginationSchema } from "~/services/types";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ContactSchema = z.object({
  email: z.string(),
  telegramUsername: z.string().nullish(),
  phone: z.string().nullish(),
  websiteUrl: z.string().nullish(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  title: z.string(),
  commitmentLabel: z.string(),
  capacity: z.number(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  displayOrder: z.number(),
});
export type Role = z.infer<typeof RoleSchema>;

export const OrganizerSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullish(),
  opportunityCount: z.number(),
  organizerLocation: z.string().nullish(),
  contact: ContactSchema,
});
export type Organizer = z.infer<typeof OrganizerSchema>;

export const OpportunitySchema = z.object({
  id: z.string(),
  category: CategorySchema,
  location: CategorySchema,
  title: z.string(),
  overview: z.string(),
  communityImpact: z.string().nullish(),
  durationLabel: z.string(),
  commitmentLabel: z.string(),
  applicationDeadline: z.string(),
  applicationCount: z.number(),
  capacity: z.number(),
  coverImageKey: z.string(),
  coverImageUrl: z.string().nullish(),
  benefits: z.array(z.string()),
  status: z.string(),
  publishedAt: z.string().nullish(),
  organizer: OrganizerSchema,
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  roles: z.array(RoleSchema),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const GetVolunteerOpportunitiesResponseSchema = z.object({
  ok: z.boolean(),
  opportunities: z.array(OpportunitySchema),
  pagination: PaginationSchema,
});
export type GetVolunteerOpportunitiesResponse = z.infer<
  typeof GetVolunteerOpportunitiesResponseSchema
>;

export const GetVolunteerOpportunityByIdResponseSchema = z.object({
  ok: z.boolean(),
  opportunity: OpportunitySchema,
});
export type GetVolunteerOpportunityByIdResponse = z.infer<
  typeof GetVolunteerOpportunityByIdResponseSchema
>;

export const PostVolunteerInputSchema = z.object({
  categoryId: z.string(),
  locationId: z.string(),
  title: z.string(),
  overview: z.string(),
  communityImpact: z.string().nullish(),
  durationLabel: z.string(),
  commitmentLabel: z.string(),
  applicationDeadline: z.string(),
  benefits: z.array(z.string()),
  contact: ContactSchema,
  roles: z.array(RoleSchema),
  coverImageKey: z.string(),
});
export type PostVolunteerInput = z.infer<typeof PostVolunteerInputSchema>;

export const VolunteerOpportunityFilterSchema = z.object({
  cursor: z.string().nullish(),
  locationId: z.string().nullish(),
  categoryId: z.string().nullish(),
  limit: z.number().nullish(),
  search: z.string().nullish(),
});

export type VolunteerOpportunityFilter = z.infer<
  typeof VolunteerOpportunityFilterSchema
>;

export const ContactInputSchema = z.object({
  email: z.string(),
  telegramUsername: z.string().nullish(),
  phone: z
    .string()
    .nullish()
    .refine((val) => {
      if (!val) return true;
      // remove spaces the user may type, handle both local input (e.g. "12 345 678")
      // and full international input with +855 already present
      const cleaned = val.replace(/\s/g, "");
      const normalized = cleaned.startsWith("+") ? cleaned : `+855${cleaned}`;
      const parsed = parsePhoneNumberFromString(
        normalized,
        "KH" as CountryCode,
      );
      return parsed?.isValid() ?? false;
    }, "Phone number must be a valid Cambodian number"),
  websiteUrl: z.string().nullish(),
});
export type ContactInput = z.infer<typeof ContactInputSchema>;

export const RoleInputSchema = z.object({
  title: z.string(),
  commitmentLabel: z.string(),
  capacity: z.number(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
});
export type RoleInput = z.infer<typeof RoleInputSchema>;

export const VolunteerOpportunityInputSchema = z.object({
  categoryId: z.string(),
  locationId: z.string(),
  title: z.string(),
  overview: z.string(),
  durationLabel: z.string().nullish(),
  commitmentLabel: z.string().nullish(),
  applicationDeadline: z.string(),
  communityImpact: z.string().nullish(),
  benefits: z.array(z.string()).nullish(),
  contact: ContactInputSchema,
  roles: z.array(RoleInputSchema),
  coverImageKey: z.string(),
});
export type VolunteerOpportunityInput = z.infer<
  typeof VolunteerOpportunityInputSchema
>;

export const CreateVolunteerOpportunityResponseSchema = z.object({
  ok: z.boolean(),
  opportunity: OpportunitySchema,
});
export type CreateVolunteerOpportunityResponse = z.infer<
  typeof CreateVolunteerOpportunityResponseSchema
>;

export const UploadOpportunityCoverImageInputSchema = z.object({
  contentType: z.string(),
  fileSize: z.number(),
});

export type UploadOpportunityCoverImageInput = z.infer<
  typeof UploadOpportunityCoverImageInputSchema
>;

export const RequiredHeadersSchema = z.object({
  "Content-Length": z.string(),
  "Content-Type": z.string(),
});

export const UploadOpportunityCoverImageUploadSchema = z.object({
  uploadUrl: z.string(),
  method: z.literal("PUT"),
  requiredHeaders: RequiredHeadersSchema,
  coverImageKey: z.string(),
  expiresInSeconds: z.number(),
});

export const UploadOpportunityCoverImageResponseSchema = z.object({
  ok: z.boolean(),
  upload: UploadOpportunityCoverImageUploadSchema,
});

export type UploadOpportunityCoverImageResponse = z.infer<
  typeof UploadOpportunityCoverImageResponseSchema
>;

export const formDataVolunteerInput = z.object({
  categoryId: z.string(),
  locationId: z.string(),
  title: z.string(),
  overview: z.string(),
  communityImpact: z.string().nullish(),
  durationLabel: z.string().nullish(),
  commitmentLabel: z.string(),
  applicationDeadline: z.string(),
  benefits: z.array(z.string()),
  contact: z.object({
    email: z.string().email(),
    telegramUsername: z.string().nullish(),
    phone: z.string().nullish(),
    websiteUrl: z.string().url().nullish(),
  }),
  roles: z.array(RoleSchema.omit({ displayOrder: true, id: true })),
  coverImageKey: z
    .object({
      file: z.any().nullish(),
      value: z.string(),
    })
    .nullish(),
});
export type FormDataVolunteerInput = z.infer<typeof formDataVolunteerInput>;

// export const initialFormDataVolunteerInput: FormDataVolunteerInput = {
//   categoryId: "",
//   locationId: "",
//   title: "",
//   overview: "",
//   communityImpact: null,
//   durationLabel: "",
//   commitmentLabel: "",
//   applicationDeadline: "",
//   benefits: [""],
//   contact: {
//     email: "",
//     telegramUsername: null,
//     phone: null,
//     websiteUrl: null,
//   },
//   roles: [
//     {
//       title: "",
//       commitmentLabel: "",
//       capacity: 1,
//       responsibilities: [""],
//       requirements: [""],
//     },
//   ],
//   coverImageKey: {
//     file: null,
//     value: "",
//   },
// };

export const initialFormDataVolunteerInput: FormDataVolunteerInput = {
  categoryId: "",
  locationId: "",
  title: "",
  overview: "",
  communityImpact: null,
  durationLabel: "",
  commitmentLabel: "",
  applicationDeadline: "",
  benefits: [],
  contact: {
    email: "",
    telegramUsername: null,
    phone: null,
    websiteUrl: null,
  },
  roles: [],
  coverImageKey: {
    file: null,
    value: "",
  },
};
