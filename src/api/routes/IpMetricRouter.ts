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



import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { IpMetricController } from "../controllers/IpMetricController";

@injectValidatorService
export class IpMetricRoute extends AbstractRoutes implements PkApi.IRoute {
  private ipMetricController: IpMetricController = new IpMetricController();
  private validatorService!: PkApi.IValidator;
  private postMetricPattern: PkApi.IValidatorPattern = {
    address: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.checkIpMetric();
    this.getIpMetrics();
  }

  private checkIpMetric(): void {
    this.getApp()
      .route("/protection/metric")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postMetricPattern);
        this.ipMetricController
          .processAddress(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getIpMetrics(): void {
    this.getApp()
      .route("/protection/metric")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipMetricController
          .getCurrentObservesingAddress()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
