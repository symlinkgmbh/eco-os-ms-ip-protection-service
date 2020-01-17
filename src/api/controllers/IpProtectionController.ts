/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import { injectIpProtectionService } from "@symlinkde/eco-os-pk-storage-ip";
import { Request } from "express";
import { MsIpProtection, PkStorageIpProtection, MsOverride } from "@symlinkde/eco-os-pk-models";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { ipProtectionContainer, IIpProtectionManger } from "../../infrastructure";
import {
  IIpProcessRequest,
  IIpProcessResponse,
} from "@symlinkde/eco-os-pk-models/lib/models/services/ms_ip_protection/Namespace";

@injectIpProtectionService
export class IpProtectionController {
  private ipProtectionService!: PkStorageIpProtection.IIpProtectionService;
  private ipProtectionManager: IIpProtectionManger = ipProtectionContainer.get<IIpProtectionManger>(
    "IIpProtectionManger",
  );

  public async add(req: Request): Promise<void> {
    return;
  }

  public async getEntryById(req: MsOverride.IRequest): Promise<void> {
    return;
  }

  public async getEntryByIp(req: MsOverride.IRequest): Promise<void> {
    return;
  }

  public async getAllEntries(): Promise<Array<MsIpProtection.IIPModel>> {
    return [];
  }

  public async getAllWhitelistEntries(): Promise<Array<MsIpProtection.IIPModel>> {
    return [];
  }

  public async getAllBlacklistEntries(): Promise<Array<MsIpProtection.IIPModel>> {
    return [];
  }

  public async searchAddress(req: MsOverride.IRequest): Promise<Array<MsIpProtection.IIPModel>> {
    return [];
  }

  public async updateEntryById(req: MsOverride.IRequest): Promise<boolean> {
    return true;
  }

  public async deleteEntryById(req: MsOverride.IRequest): Promise<boolean> {
    return true;
  }

  public async deleteBlacklist(): Promise<boolean> {
    return true;
  }

  public async deleteWhitelist(): Promise<boolean> {
    return true;
  }

  public async processAddress(obj: IIpProcessRequest): Promise<void> {
    return;
  }
}
