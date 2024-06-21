"use client";

import { useSuspenseQuery } from "@connectrpc/connect-query";
import { Button, Radio, RadioGroup, Spacer } from "@nextui-org/react";
import useTokenHeader from "lib/clerk/token/hook";
import { getSample } from "lib/pb/lmsysmd/sample/v1/sample-SampleService_connectquery";
import type {
  GetSampleRequest,
  GetSampleResponse,
  Sample_Choice,
} from "lib/pb/lmsysmd/sample/v1/sample_pb";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { type FormEvent, useCallback } from "react";

export default function Rating() {
  const [id, _setId] = useQueryState("id");
  if (!id) throw new Promise((r) => setTimeout(r, 100));
  const sampleId = Number.parseInt(id);
  const tk = useTokenHeader();
  const {
    data: { sample },
  } = useSuspenseQuery<GetSampleRequest, GetSampleResponse>(
    getSample,
    { sampleId },
    { callOptions: { headers: tk } },
  ) as { data: GetSampleResponse };
  const router = useRouter();
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const choice = data.get(sampleId.toString())?.toString();
      if (choice === "skip") router.push("/rating");
      else
        router.push(
          `/rating/id/confirm?sid=${sampleId}&cid=${choice}&ts=${new Date().getTime()}`,
        );
    },
    [router, sampleId],
  );
  const { content, choices, truth } = sample as {
    content: string;
    choices: Sample_Choice[];
    truth: string;
  };
  return (
    <form className="md:mx-auto md:max-w-md" onSubmit={onSubmit}>
      <p className="font-semibold text-large text-primary">
        Ground Truth: {truth}
      </p>
      <Spacer y={4} />
      <RadioGroup
        classNames={{ label: "text-foreground" }}
        isRequired
        label={content}
        name={sampleId.toString()}
        validationBehavior="native"
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
      <Button color="primary" fullWidth type="submit">
        Submit Rating
      </Button>
    </form>
  );
}