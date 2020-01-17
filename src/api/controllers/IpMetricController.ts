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




import { injectRedisClient } from "@symlinkde/eco-os-pk-redis";
import { Request } from "express";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";
import { injectIpProtectionService } from "@symlinkde/eco-os-pk-storage-ip";
import { MsConf, PkCore, PkRedis, PkStorageIpProtection, MsIpProtection } from "@symlinkde/eco-os-pk-models";
import { injectConfigClient } from "@symlinkde/eco-os-pk-core";

@injectIpProtectionService
@injectRedisClient
@injectConfigClient
export class IpMetricController {
  private redisClient!: PkRedis.IRedisClient;
  private ipProtectionService!: PkStorageIpProtection.IIpProtectionService;
  private configClient!: PkCore.IEcoConfigClient;

  public async processAddress(req: Request): Promise<void> {
    const config = await this.loadDosConfig();
    const { address } = req.body;
    const result: MsIpProtection.IIPObservingModel = await this.redisClient.get(`ip.${address}`);
    if (result === null) {
      this.redisClient.set(
        `ip.${address}`,
        <MsIpProtection.IIPObservingModel>{ calls: 1, address, observing: true, observingTime: new Date() },
        config.cacheTime,
      );
      return;
    }

    if (result.calls > config.maxCalls) {
      Log.log(`${address} exceeds max calls and will moved to blacklist`, LogLevel.warning);
      this.addEntryToBlacklist(address);
      return;
    }

    this.redisClient.set(
      `ip.${address}`,
      <MsIpProtection.IIPObservingModel>{
        calls: result.calls + 1,
        address,
        observing: true,
        observingTime: new Date(),
      },
      config.cacheTime,
    );
    return;
  }

  public async getCurrentObservesingAddress(): Promise<Array<MsIpProtection.IIPObservingModel>> {
    const result = await this.redisClient.getAll<MsIpProtection.IIPObservingModel>("ip*");
    return result.map((entry: MsIpProtection.IIPObservingModel) => {
      return {
        address: entry.address,
        calls: entry.calls,
        observing: entry.observing,
        observingTime: entry.observingTime,
        ttl: this.calcTTL(entry.observingTime),
      };
    });
  }

  private calcTTL(time: Date | undefined): Date {
    if (time === undefined) {
      return new Date();
    }

    const sec = new Date(time).setSeconds(new Date(time).getSeconds() + 30);
    return new Date(sec);
  }

  private async addEntryToBlacklist(address: string): Promise<void> {
    const checkIfExists = await this.ipProtectionService.getEntryByIp(address);

    if (checkIfExists !== undefined && checkIfExists !== null) {
      return;
    }

    await this.ipProtectionService.add({ address, deny: true });
    Log.log(`${address} was successfully added to blacklist`, LogLevel.warning);
    return;
  }

  private async loadDosConfig(): Promise<MsConf.IDosConfig> {
    const dosConfig = await this.configClient.get("dos");
    return <MsConf.IDosConfig>Object(dosConfig.data.dos);
  }
}
