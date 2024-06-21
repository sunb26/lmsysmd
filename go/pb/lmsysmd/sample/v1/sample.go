package sample

import (
	"context"

	"connectrpc.com/connect"
	samplev1 "github.com/Lev1ty/lmsysmd/pbi/lmsysmd/sample/v1"
	"github.com/Lev1ty/lmsysmd/pbi/lmsysmd/sample/v1/samplev1connect"
)

type SampleService struct {
	samplev1connect.UnimplementedSampleServiceHandler
}

func (ss *SampleService) GetSample(
	ctx context.Context,
	req *connect.Request[samplev1.GetSampleRequest],
) (*connect.Response[samplev1.GetSampleResponse], error) {
	return connect.NewResponse(&samplev1.GetSampleResponse{Sample: &samplev1.Sample{
		SampleId: 1,
		Content:  "Compare the Ground Truth answer to the proposed Differential Diagnosis. Select the highest ranked correct answer.",
		Choices: []*samplev1.Sample_Choice{
			{ChoiceId: 1, Content: "Paraganglioma"},
			{ChoiceId: 2, Content: "Schwannoma"},
			{ChoiceId: 3, Content: "Carotid body tumor"},
			{ChoiceId: 4, Content: "Glomus vagale tumor"},
			{ChoiceId: 5, Content: "Metastatic lymphadenopathy"},
		},
		Truth: "Glomus vagale tumor",
	}}), nil
}
