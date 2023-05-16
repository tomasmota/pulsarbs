import { useApi } from '@backstage/core-plugin-api';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { pulsarApiRef, Topic } from '../../api/types';
import { Select } from '@backstage/core-components';

type TopicPickerProps = {
  selectedTopic: Topic | undefined;
  setSelectedTopic: (value: Topic) => void;
};

export const TopicPicker = ({
  selectedTopic,
  setSelectedTopic
}: TopicPickerProps) => {
  const pulsarApi = useApi(pulsarApiRef);

  const { value, loading, error } = useAsync(async () => {
    const topics = await pulsarApi.getTopics();
    // onChange(topics[0]);
    return topics;
  }, []);

  return (
    <>
      {!error && value !== undefined && (
        <Select
          native
          label="Topics"
          onChange={selected => {
            const s = String(Array.isArray(selected) ? selected[0] : selected);
            setSelectedTopic(value.find(t => t.fullName === s)!);
          }}
          // Figure out how to show the selectedTopic here
          items={
            loading
              ? [{ label: 'Loading...', value: 'loading' }]
              : value.map(t => ({
                  label: t.fullName,
                  value: t.fullName,
                })) || []
          }
        />
      )}
    </>
  );
};
