import { useApi } from '@backstage/core-plugin-api';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { pulsarApiRef, Topic } from '../../api/types';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { InfoCard, Progress, WarningPanel } from '@backstage/core-components';

/** @public */
export type TopicStatsContentProps = {
  topic: Topic;
};

/** @public */
export const TopicStatsContent = ({ topic }: TopicStatsContentProps) => {
  const pulsarApi = useApi(pulsarApiRef);

  const {
    value: stats,
    loading,
    error,
  } = useAsync(async () => {
    return await pulsarApi.getTopicStats(
      topic.tenant,
      topic.namespace,
      topic.name,
    );
  }, [topic]);

  return (
    <>
      {loading && <Progress />}

      {!loading && error && (
        //TODO: test this out
        <WarningPanel
          title="Failed to fetch topic stats"
          message={error?.message}
        />
      )}

      {!error && !loading && stats !== undefined && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InfoCard>
                <Typography variant="h5">Throughput</Typography>
                <Typography>
                  Ingress: {Math.round(stats.msgRateIn)} msg/s
                </Typography>
                <Typography>
                  Egress: {Math.round(stats.msgRateOut)} msg/s
                </Typography>
                <Typography>
                  Backlog size: {Math.round(stats.backlogSize)} messages
                </Typography>
              </InfoCard>
            </Grid>

            <Grid item xs={6}>
              <Paper>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producer</TableCell>
                      <TableCell>msg/s</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.publishers.map((p, index) => (
                      <TableRow key={index}>
                        <TableCell>{p.producerName}</TableCell>
                        <TableCell>{p.msgRateIn.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Consumer</TableCell>
                      <TableCell>msg/s</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(stats.subscriptions).map(
                      ([subName, subContent]) => {
                        return (
                          <TableRow key={subName}>
                            <TableCell>{subName}</TableCell>
                            <TableCell>{subContent.messageAckRate}</TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};
