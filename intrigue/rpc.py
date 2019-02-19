

import grpc
import json

import intrigue.intrigue_pb2 as intrigue_pb2
import intrigue.intrigue_pb2_grpc as intrigue_pb2_grpc

class Bridge:

    # requestServices queries the cabal server for all attached services
    def requestServices(self):
        channel = grpc.insecure_channel('localhost:49500')
        try:
            grpc.channel_ready_future(channel).result(timeout=5)
        except grpc.FutureTimeoutError:
            return('Error connecting to server')
        stub = intrigue_pb2_grpc.CabalStub(channel)
        request = intrigue_pb2.Action(
            Request="request.info.all"
        )

        try:
            response = stub.Summary(request)
            if response.Error != "":
                print(response.Error)
                return {}

            ret = []
            for service in response.Services:
                data = {}
                data["name"] = service.Name
                data["address"] = service.Address
                data["mode"] = service.Mode
                data["parentID"] = service.ParentID
                ret.append(data)

            return(json.dumps(ret))
        except grpc.RpcError as e:
            return "could not contact server"


    # requestRemotes queries the control server for all attached services
    def requestRemotes(self):
        channel = grpc.insecure_channel('localhost:59500')
        try:
            grpc.channel_ready_future(channel).result(timeout=5)
        except grpc.FutureTimeoutError:
            return('Error connecting to server')
        stub = intrigue_pb2_grpc.ControlStub(channel)
        request = intrigue_pb2.Action(
            Request="summary.all"
        )
        try:
            response = stub.Summary(request)

            if response.Error != "":
                print(response.Error)
                return {}

            ret = []
            for remote in response.Remotes:
                data = {}
                data["address"] = remote.Address
                data["startTime"] = remote.StartTime
                data["id"] = remote.ID
                data["status"] = remote.Status
                data["errors"] = []
                for e in remote.Errors:
                    data["errors"].appen(e)
                data["logPath"] = remote.LogPath
                data["services"] = []
                for service in remote.Services:
                    sdata = {}
                    sdata["id"] = service.Id
                    sdata["name"] = service.Name
                    sdata["address"] = service.Address
                    sdata["path"] = service.Path
                    sdata["status"] = service.Status
                    sdata["pid"] = service.Pid
                    sdata["errors"] = []
                    for e in service.Errors:
                        sdata["errors"].append(e)
                    sdata["startTime"] = service.StartTime
                    sdata["failTime"] = service.FailTime
                    sdata["fails"] = service.Fails
                    sdata["restarts"] = service.Restarts
                    sdata["logPath"] = service.LogPath
                    sdata["mode"] = service.Mode
                    data["services"].append(sdata)
                ret.append(data)

            return(json.dumps(ret))
        except grpc.RpcError as e:
            return "could not contact server"

    def restart(self):
        channel = grpc.insecure_channel('localhost:59500')
        try:
            grpc.channel_ready_future(channel).result(timeout=5)
        except grpc.FutureTimeoutError:
            return('Error connecting to server')
        stub = intrigue_pb2_grpc.ControlStub(channel)
        request = intrigue_pb2.Action(
            Request="restart.all"
        )
        try:
            response = stub.RestartService(request)
            if response.Error != "":
                print(response.Error)
                return("failure")

            return response.Message
        except grpc.RpcError:
            return "could not contact server"

    def restart_one(self, parentid: str, id: str):
        channel = grpc.insecure_channel('localhost:59500')
        try:
            grpc.channel_ready_future(channel).result(timeout=5)
        except grpc.FutureTimeoutError:
            return('Error connecting to server')
        stub = intrigue_pb2_grpc.ControlStub(channel)

        request = intrigue_pb2.Action(
            Request="restart.one",
            RemoteID=parentid,
            Target=id,
        )
        try:
            response = stub.RestartService(request)
            if response.Error != "":
                print(response.Error)
                return("failure")

            return response.Message
        except grpc.RpcError:
            return "could not contact server"
