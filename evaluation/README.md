# Evaluation evidence

On September 6, 2026, Amazon Nova Lite (amazon.nova-lite-v1:0) matched the reference classification on 20/20 development-authored synthetic examples in cases.json. results.json contains findings and usage metadata. The runner invoked Bedrock using the AWS CLI, the application's exact prompt, and its shared validator; it did not exercise the hosted website.

This is a small development set, not a blind, held-out, or independent benchmark. Agreement on these examples is not an estimate of real seller accuracy. Unsupported-claim precision and recall on this set were both 1.0. No time-saving or user-study result is claimed.

A later complete local API -> Lambda -> Bedrock check exposed an abstention on equivalent quantities. A narrow deterministic rule was then added for whole-line capacity and pack assertions with one unambiguous source. These results predate that change and are retained as historical evidence, not relabeled as a rerun.

For a new evaluation, freeze source and prompt versions before collecting new examples, have a person independently label them, retain disagreements, and score classification and citation correctness separately. Live evaluation consumes AWS resources; default tests make no model calls.
