"use client";

import { useSuspenseQuery } from "@connectrpc/connect-query";
import { Button, Radio, RadioGroup, Spacer } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useTokenHeader from "lib/clerk/token/hook";
import { getSample } from "lib/pb/lmsysmd/sample/v1/sample-SampleService_connectquery";
import type {
  GetSampleRequest,
  GetSampleResponse,
  Sample_Choice,
} from "lib/pb/lmsysmd/sample/v1/sample_pb";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { type FormEvent, useCallback, useEffect } from "react";
import { useCountdown } from "usehooks-ts";

export default function Confirm() {
  const [sid, _setSampleId] = useQueryState("sid");
  if (!sid) throw new Promise((r) => setTimeout(r, 100));
  const sampleId = Number.parseInt(sid);
  const [choiceId, _setChoiceId] = useQueryState("cid");
  if (!choiceId) throw new Promise((r) => setTimeout(r, 100));
  const tk = useTokenHeader();
  const {
    data: { sample },
  } = useSuspenseQuery<GetSampleRequest, GetSampleResponse>(
    getSample,
    { sampleId },
    { callOptions: { headers: tk } },
  ) as { data: GetSampleResponse };
  const { content, choices, truth } = sample as {
    content: string;
    choices: Sample_Choice[];
    truth: string;
  };
  const [count, { startCountdown }] = useCountdown({
    countStart: 3,
    intervalMs: 1000,
  });
  useEffect(() => {
    startCountdown();
  }, [startCountdown]);
  const router = useRouter();
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const choice = data.get(sampleId.toString())?.toString();
      console.log(choice);
      router.push(`/rating?ts=${new Date().getTime()}`);
    },
    [router, sampleId],
  );
  const onPress = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <form className="md:mx-auto md:max-w-md" onSubmit={onSubmit}>
      <p className="font-semibold text-large text-primary">
        Ground Truth: {truth}
      </p>
      <Spacer y={4} />
      <RadioGroup
        classNames={{ label: "text-foreground" }}
        isReadOnly
        label={content}
        name={sampleId.toString()}
        value={choiceId}
      >
        {choices.map(({ choiceId, content }: Sample_Choice, index) => (
          <Radio key={choiceId} value={choiceId.toString()}>
            {index + 1}.&nbsp;{content}
          </Radio>
        ))}
        <Radio value="nota">None of the above</Radio>
        <Radio value="skip">Skip</Radio>
      </RadioGroup>
      <Spacer y={4} />
      <div className="flex flex-row gap-2">
        <Button color="primary" fullWidth isLoading={count > 0} type="submit">
          Confirm&nbsp;Rating&nbsp;{!!count && `(${count})`}
        </Button>
        <Button fullWidth onPress={onPress}>
          Go&nbsp;Back
        </Button>
      </div>
    </form>
  );
}
