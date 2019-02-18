# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import intrigue.intrigue_pb2 as intrigue__pb2


class CabalStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.RegisterService = channel.unary_unary(
        '/intrigue.Cabal/RegisterService',
        request_serializer=intrigue__pb2.NewServiceRequest.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.UpdateRegistration = channel.unary_unary(
        '/intrigue.Cabal/UpdateRegistration',
        request_serializer=intrigue__pb2.ServiceUpdate.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.Data = channel.unary_unary(
        '/intrigue.Cabal/Data',
        request_serializer=intrigue__pb2.DataRequest.SerializeToString,
        response_deserializer=intrigue__pb2.DataResponse.FromString,
        )
    self.Summary = channel.unary_unary(
        '/intrigue.Cabal/Summary',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.SummaryReceipt.FromString,
        )
    self.Alive = channel.unary_unary(
        '/intrigue.Cabal/Alive',
        request_serializer=intrigue__pb2.Ping.SerializeToString,
        response_deserializer=intrigue__pb2.Pong.FromString,
        )


class CabalServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def RegisterService(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def UpdateRegistration(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Data(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Summary(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Alive(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_CabalServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'RegisterService': grpc.unary_unary_rpc_method_handler(
          servicer.RegisterService,
          request_deserializer=intrigue__pb2.NewServiceRequest.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'UpdateRegistration': grpc.unary_unary_rpc_method_handler(
          servicer.UpdateRegistration,
          request_deserializer=intrigue__pb2.ServiceUpdate.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'Data': grpc.unary_unary_rpc_method_handler(
          servicer.Data,
          request_deserializer=intrigue__pb2.DataRequest.FromString,
          response_serializer=intrigue__pb2.DataResponse.SerializeToString,
      ),
      'Summary': grpc.unary_unary_rpc_method_handler(
          servicer.Summary,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.SummaryReceipt.SerializeToString,
      ),
      'Alive': grpc.unary_unary_rpc_method_handler(
          servicer.Alive,
          request_deserializer=intrigue__pb2.Ping.FromString,
          response_serializer=intrigue__pb2.Pong.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'intrigue.Cabal', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class RemoteStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.NotifyAction = channel.unary_unary(
        '/intrigue.Remote/NotifyAction',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.Action.FromString,
        )
    self.Summary = channel.unary_unary(
        '/intrigue.Remote/Summary',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.SummaryReceipt.FromString,
        )
    self.UpdateRegistration = channel.unary_unary(
        '/intrigue.Remote/UpdateRegistration',
        request_serializer=intrigue__pb2.ServiceUpdate.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.Alive = channel.unary_unary(
        '/intrigue.Remote/Alive',
        request_serializer=intrigue__pb2.Ping.SerializeToString,
        response_deserializer=intrigue__pb2.Pong.FromString,
        )


class RemoteServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def NotifyAction(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Summary(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def UpdateRegistration(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Alive(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_RemoteServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'NotifyAction': grpc.unary_unary_rpc_method_handler(
          servicer.NotifyAction,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.Action.SerializeToString,
      ),
      'Summary': grpc.unary_unary_rpc_method_handler(
          servicer.Summary,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.SummaryReceipt.SerializeToString,
      ),
      'UpdateRegistration': grpc.unary_unary_rpc_method_handler(
          servicer.UpdateRegistration,
          request_deserializer=intrigue__pb2.ServiceUpdate.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'Alive': grpc.unary_unary_rpc_method_handler(
          servicer.Alive,
          request_deserializer=intrigue__pb2.Ping.FromString,
          response_serializer=intrigue__pb2.Pong.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'intrigue.Remote', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class ControlStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.StartService = channel.unary_unary(
        '/intrigue.Control/StartService',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.RestartService = channel.unary_unary(
        '/intrigue.Control/RestartService',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.KillService = channel.unary_unary(
        '/intrigue.Control/KillService',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.Summary = channel.unary_unary(
        '/intrigue.Control/Summary',
        request_serializer=intrigue__pb2.Action.SerializeToString,
        response_deserializer=intrigue__pb2.SummaryReceipt.FromString,
        )
    self.UpdateRegistration = channel.unary_unary(
        '/intrigue.Control/UpdateRegistration',
        request_serializer=intrigue__pb2.ServiceUpdate.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )
    self.Alive = channel.unary_unary(
        '/intrigue.Control/Alive',
        request_serializer=intrigue__pb2.Ping.SerializeToString,
        response_deserializer=intrigue__pb2.Pong.FromString,
        )
    self.StopServer = channel.unary_unary(
        '/intrigue.Control/StopServer',
        request_serializer=intrigue__pb2.EmptyRequest.SerializeToString,
        response_deserializer=intrigue__pb2.Receipt.FromString,
        )


class ControlServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def StartService(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def RestartService(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def KillService(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Summary(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def UpdateRegistration(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def Alive(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def StopServer(self, request, context):
    # missing associated documentation comment in .proto file
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_ControlServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'StartService': grpc.unary_unary_rpc_method_handler(
          servicer.StartService,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'RestartService': grpc.unary_unary_rpc_method_handler(
          servicer.RestartService,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'KillService': grpc.unary_unary_rpc_method_handler(
          servicer.KillService,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'Summary': grpc.unary_unary_rpc_method_handler(
          servicer.Summary,
          request_deserializer=intrigue__pb2.Action.FromString,
          response_serializer=intrigue__pb2.SummaryReceipt.SerializeToString,
      ),
      'UpdateRegistration': grpc.unary_unary_rpc_method_handler(
          servicer.UpdateRegistration,
          request_deserializer=intrigue__pb2.ServiceUpdate.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
      'Alive': grpc.unary_unary_rpc_method_handler(
          servicer.Alive,
          request_deserializer=intrigue__pb2.Ping.FromString,
          response_serializer=intrigue__pb2.Pong.SerializeToString,
      ),
      'StopServer': grpc.unary_unary_rpc_method_handler(
          servicer.StopServer,
          request_deserializer=intrigue__pb2.EmptyRequest.FromString,
          response_serializer=intrigue__pb2.Receipt.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'intrigue.Control', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
