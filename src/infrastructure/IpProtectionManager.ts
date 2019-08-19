/** 
* Copyright 2018-2019 Symlink GmbH 
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

import { IIpProtectionManger } from "./IIpProtectionManager";
import { injectable } from "inversify";
import { injectIpProtectionService } from "@symlinkde/eco-os-pk-storage-ip";
import { injectRedisClient } from "@symlinkde/eco-os-pk-redis";
import { injectConfigClient } from "@symlinkde/eco-os-pk-core";

// tslint:disable-next-line:no-var-requires
const ipaddr = require("ipaddr.js");

@injectConfigClient
@injectRedisClient
@injectIpProtectionService
@injectable()
class IpProtectionManager implements IIpProtectionManger {
  public async processIpAddress(address: string): Promise<void> {
    return;
  }
}

export { IpProtectionManager };
