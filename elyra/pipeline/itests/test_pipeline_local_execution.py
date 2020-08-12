#
# Copyright 2018-2020 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import json

from elyra.pipeline import PipelineParser, LocalPipelineProcessor


def test_pipeline_locally():
    pipeline_definition = _read_pipeline_resource('pipeline.json')
    pipeline = PipelineParser().parse(pipeline_definition)

    processor = LocalPipelineProcessor(root_dir='/Users/lresende/opensource/jupyter-notebooks')
    response = processor.process(pipeline=pipeline)
    json_msg = json.dumps(response.to_json())

    print(json_msg)


def _read_pipeline_resource(pipeline_filename):
    root = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    pipeline_path = os.path.join(root, pipeline_filename)

    with open(pipeline_path, 'r') as f:
        pipeline_json = json.load(f)

    return pipeline_json