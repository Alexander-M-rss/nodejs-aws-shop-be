import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Request } from 'express';

interface ServiceResponse {
  headers: AxiosResponse['headers'];
  data: AxiosResponse['data'];
  status: AxiosResponse['status'];
}

@Injectable()
export class AppService {
  async getResponse(
    service: string,
    request: Request,
  ): Promise<ServiceResponse> {
    const { method, headers, body, originalUrl } = request;
    const serviceUrl = process.env[service];

    if (!serviceUrl) {
      throw new BadGatewayException('Cannot process request');
    }

    try {
      const serviceRequest: AxiosRequestConfig = {
        method,
        url: `${serviceUrl}${originalUrl}`,
      };
      const authorizationHeader = headers['authorization'];

      if (authorizationHeader) {
        serviceRequest.headers = {};
        serviceRequest.headers['authorization'] = authorizationHeader;
      }

      if (Object.keys(body).length) {
        serviceRequest.data = body;
      }

      const response = await axios.request(serviceRequest);

      const result = {
        headers: response.headers,
        data: response.data,
        status: response.status,
      };

      return result;
    } catch (e) {
      if (e.response) {
        const result = {
          headers: e.response.headers,
          data: e.response.data,
          status: e.response.status,
        };

        return result;
      }

      throw new InternalServerErrorException(e.message);
    }
  }
}
