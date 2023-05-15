import { createApiRef } from '@backstage/core-plugin-api';

export type Namespace = {
  tenant: string;
  name: string;
};

export type Topic = {
  tenant: string;
  namespace: string;
  persistent: boolean;
  name: string;
  stats?: TopicStats;
};

export type TopicStats = {
  msgRateIn: number;
  msgRateOut: number;
  msgInCounter: number;
  averageMsgSize: number;
};

/**
 * The API used by the pulsar plugin to get pulsar information
 *
 * @public
 */
export interface PulsarApi {
  /** Get stats for this pulsar topic */
  getTopicStats(
    tenant: string,
    namespace: string,
    topic: string,
  ): Promise<TopicStats>;

  // getNamespaces(tenant: string): Promise<Namespace[]>;

  getTopics(): Promise<Topic[]>;
}

/**
 * ApiRef for the PulsarApi.
 *
 * @public
 */
export const pulsarApiRef = createApiRef<PulsarApi>({
  id: 'plugin.pulsar.api',
});
