import {v1} from '@authzed/authzed-node'
import {PartialMessage} from '@protobuf-ts/runtime'
import {
  CheckPermissionResponse_Permissionship
} from '@authzed/authzed-node/dist/src/authzedapi/authzed/api/v1/permission_service'
import { Permission } from '@app/config/auth'

const token = process.env.PERMISSIONS_API_TOKEN
const prefix = process.env.PERMISSIONS_PREFIX
export type ObjectType = string & 'user' | 'org'

export type SubjectType = ObjectType
export type ResourceType = ObjectType

if (!token) {
  throw new Error(`PERMISSIONS_API_TOKEN missing`)
}

const client = v1.NewClient(token)

export type ObjectReference = v1.ObjectReference;
export type Resource<T extends ResourceType> = {
  objectType: T;
} & ObjectReference;
export type Subject<T extends ResourceType> = {
  objectType: T;
} & PartialMessage<ObjectReference>;

export const checkPermission = <
T extends ResourceType,
ST extends ResourceType
>(res: Resource<T>, sub: Subject<ST>, permission: Permission<T>) => {
  return new Promise<boolean>((resolve, reject) => {
    const resource = v1.ObjectReference.create({
      objectId: res.objectId,
      objectType: `${prefix}${res.objectType}`
    })

    const subject = v1.SubjectReference.create({
      object: v1.ObjectReference.create({
        objectType: `${prefix}${sub.objectType}`,
        objectId: sub.objectId
      })
    })

    const checkPermissionRequest = v1.CheckPermissionRequest.create({
      resource,
      permission,
      subject,
      // constrain permission check
      // consistency: {
      //   requirement: {
      //     atLeastAsFresh: zedToken, // for having time constraint
      //     fullyConsistent: true // or fully consistent if not using zedToken
      //   }
      // }
    })

    client.checkPermission(checkPermissionRequest, (err, response) => {
      if (err) {
        reject(err.message)
        return
      }
      if (!response) {
        reject(false)
        return
      }
      if (response.permissionship === CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
        resolve(true)
      }

      resolve(false)
    })
  })
}
