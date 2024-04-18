import {
  CustomFieldDto,
  CustomFieldDtoContextTypeEnum as CustomFieldContextTypeEnum,
  CustomFieldDtoFieldCategoryTypeEnum as CustomFieldCategoryTypeEnum,
} from './swagger/models/CustomFieldDto';

export type ICustomField = Required<CustomFieldDto>;

export type ICategoriedCustomFields = {
  [key in CustomFieldCategoryTypeEnum]: ICustomField[];
};

export { CustomFieldContextTypeEnum, CustomFieldCategoryTypeEnum };
